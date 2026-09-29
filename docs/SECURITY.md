# Security Architecture & Production Hardening Guide

The College Management System is engineered according to enterprise-grade, defense-in-depth security standards. This document details the cryptographic architecture, Role-Based Access Control (RBAC), and the full audit results and mitigations based on the **5 Security Checks Before Launch** framework (`vibe-coding-security-prompts.pdf`).

---

## 1. Core Authentication & Authorization Architecture

### Stateless JWT Authentication Flow
1. **Credentials Validation**: `POST /api/v1/auth/login` receives `LoginRequest` (passwords excluded from `@ToString` logging). `CustomUserDetailsService` validates hashed credentials via BCrypt (`$2a$10$...`).
2. **Dual-Token Generation**:
   - **Access Token**: Short-lived (default 24h), cryptographically signed using HMAC-SHA256 (`app.jwt.secret`), encapsulating user ID, username, and assigned authority roles.
   - **Refresh Token**: Long-lived (7d) opaque UUID token persisted in the `refresh_tokens` database table with revocation flags (`is_revoked`).
3. **Session Invalidation**:
   - `POST /api/v1/auth/logout`: Revokes the refresh token in the persistence store.
   - New login attempts purge all existing active refresh tokens for the authenticated user, enforcing single active session hygiene.
4. **Rate Limiting**:
   - In-memory sliding-window IP rate limiter (`RateLimitingFilter`) restricts `POST /api/v1/auth/login` and `POST /api/v1/auth/refresh-token` to **5 requests per minute per IP**, returning `429 Too Many Requests` on abuse.

---

## 2. Role-Based Access Control (RBAC) & Method Security

Method security is enforced server-side via Spring Security's `@EnableMethodSecurity(prePostEnabled = true)`:

| Role | Operational Scope | Typical Privileges |
|---|---|---|
| `SUPER_ADMIN` | Global System Administration | College setup, full audit log inspection, user role management. |
| `ADMIN` | Institutional Operations | Department, course, professor, and student lifecycle management. |
| `HOD` | Department Leadership | Faculty subject assignment, curriculum management, exam result publishing. |
| `PROFESSOR` | Academic Instruction | Daily attendance logging, subject grade & marks entry. |
| `ACCOUNTANT` | Financial Governance | Fee structure definitions, offline payment recording, refund processing. |
| `STUDENT` | Academic Self-Service | Own enrollment, own attendance stats, own report cards, own fee payments. |
| `LIBRARIAN` | Auxiliary Academic Staff | Student verification. |

---

## 3. Five-Phase Launch Security Audit Matrix

This system has been hardened against the 5 launch security checks defined in professional security frameworks (Gitleaks, Bearer, ECC Production Audit, and Trail of Bits):

### Check 01: Secret Leak Prevention (Based on Gitleaks)
- **Vulnerability**: Hardcoded database passwords and JWT signing keys in source code or configuration files risk immediate compromise if exposed in public version control.
- **Attacker Potential**: Full database takeover, arbitrary JWT forgery, and impersonation of any system role.
- **Architectural Mitigation**:
  - `application-prod.yml` strictly enforces `${JWT_SECRET}` and `${DB_PASSWORD}` without default fallbacks.
  - Development defaults (`application.yml`) are isolated and clearly documented.
  - Root `.gitignore` enforces exclusion of `.env`, `*.key`, `*.jks`, and credential files.
  - Secret rotation instructions documented in `README.md`.

### Check 02: Personal Data Flow Audit (Based on Bearer)
- **Vulnerability**:
  - PII (passwords, emails, phone numbers) leaking into application console logs via `toString()`.
  - Non-compliance with privacy regulations (GDPR / Indian DPDP Act) requiring user data deletion.
- **Attacker Potential**: Log extraction through log-harvesting attacks, lateral user impersonation, compliance breach penalties.
- **Architectural Mitigation**:
  - Added `@ToString(exclude = "password")` to `LoginRequest`.
  - Implemented GDPR Right-to-be-Forgotten anonymization flow (`DELETE /api/v1/users/{id}`) which sanitizes sensitive attributes (`email`, `username`, `phone`) to anonymized hashes and deactivates access without violating foreign-key referential integrity in academic records.
  - Integrated `SecurityService.isOwner(userId)` to verify user profile access boundaries.

### Check 03: Pre-Deploy Production Audit (Based on ECC Production Audit)
- **Vulnerability**: Missing browser security headers and rate limits allowing clickjacking, MIME sniffing, and brute-force credential stuffing.
- **Attacker Potential**: UI redress/clickjacking attacks, credential stuffing on login, unauthorized framing.
- **Architectural Mitigation**:
  - Configured HTTP Security Headers in `SecurityConfig.java`:
    - `X-Frame-Options: DENY`
    - `X-Content-Type-Options: nosniff`
    - `Strict-Transport-Security: max-age=31536000; includeSubDomains` (HSTS)
    - `Content-Security-Policy: default-src 'self'; frame-ancestors 'none';`
  - Added `RateLimitingFilter` enforcing 5 req/min on `/api/v1/auth/login` and `/api/v1/auth/refresh-token`.
  - Sanitized production error responses (`server.error.include-message: never`, `server.error.include-stacktrace: never`) and restricted Actuator health details (`management.endpoint.health.show-details: never`) in `application-prod.yml`.

### Check 04: Deep Security Audit for Complex Logic (Based on Trail of Bits)
- **Vulnerability**:
  - **Insecure Direct Object Reference (IDOR)**: Endpoints accepting student IDs or invoice IDs allowed students to view peer students' academic and financial records.
  - **Payment Logic Manipulation**: Potential client-side manipulation of payment amount (zero, negative, or overpayments).
  - **Missing Authorization Guards**: `CollegeController`, `DepartmentController`, and `ProfessorController` were missing `@PreAuthorize` guards.
- **Attacker Potential**: Accessing peer students' exam grades and fee dues; forging zero or negative payment transactions; unauthorized creation or deactivation of professors and departments.
- **Architectural Mitigation**:
  - Added `isStudentOwner(studentId)`, `isInvoiceOwner(invoiceId)`, and `isPaymentOwner(receiptNumber)` in `SecurityService.java`.
  - Bound ownership checks to `StudentController`, `FeeController`, `AttendanceController`, and `ResultController`.
  - Added `@PreAuthorize` authorization guards across all endpoints in `CollegeController`, `DepartmentController`, and `ProfessorController`.
  - Hardened `FeeServiceImpl` with strict server-side validation rejecting zero/negative payments, payments on settled invoices (`PAID`), overpayments beyond remaining balance, and discounts exceeding fee structure amounts.
  - Enforced multipart request limits (`max-file-size: 5MB`, `max-request-size: 10MB`) in `application.yml`.

### Check 05: Attacker's Perspective Review (Based on ECC Security Review)
- **Vulnerability**: Privilege escalation attempts, token replay, content injection, and feature abuse.
- **Attacker Potential**: Horizontal privilege escalation (student accessing another student's data) or vertical privilege escalation (student invoking admin endpoints).
- **Architectural Mitigation**:
  - **Cryptographic Signature Verification**: Role escalation via client-side JWT modification is mathematically prevented by HMAC-SHA signature verification on every request.
  - **Strict Server-Side Validation**: All controllers enforce server-side validation (`@Valid`, `@PositiveOrZero`, `@NotBlank`) before invoking service logic.
  - **SQL Injection Prevention**: 100% of database interactions use Spring Data JPA parameterized queries and type-safe entity relationships.
  - **XSS Prevention**: React JSX and Angular template bindings automatically escape HTML/script payloads, complemented by HTTP `Content-Security-Policy`.

---

## 4. Security Verification & Testing

The security architecture is verified through continuous automated testing:
- **Unit & Service Layer Tests**: `mvn test "-Dtest=*ServiceTest"` verifies business validation, overpayment rejections, and exception handling.
- **Web Layer Security Tests**: `mvn test "-Dtest=*ControllerTest"` verifies request validation, error formatting, and HTTP status codes.
- **Exception Sanitization**: `GlobalExceptionHandlerTest` verifies that raw stack traces and internal query details are never returned to clients, outputting standardized `ApiError` payloads with unique correlation trace IDs.