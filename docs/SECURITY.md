# Security Architecture & RBAC

The system implements industry-standard stateless security with **Spring Security 6.x** and **JSON Web Tokens (JJWT 0.12.6)**.

## 1. Authentication Flow
1. **Login**: Client submits credentials to `POST /api/v1/auth/login`.
2. **Verification**: `CustomUserDetailsService` resolves the account from MySQL. Password matches against BCrypt hash (`$2a$10$...`).
3. **Token Issuance**: `JwtTokenProvider` generates:
   - **Access Token**: Short-lived (24h) JWT containing User ID, Username, and granted Authorities.
   - **Refresh Token**: Long-lived (7d) cryptographic string stored in the `refresh_tokens` database table.
4. **Token Refresh**: When the access token expires, clients call `POST /api/v1/auth/refresh-token` to rotate tokens without requiring re-authentication.

## 2. Role-Based Access Control (RBAC)

### Roles
- `SUPER_ADMIN`: Unlimited administrative control, audit log inspection, college creation.
- `ADMIN`: College and department operational administration.
- `HOD`: Department administration, professor subject assignments, result publishing.
- `PROFESSOR`: Attendance logging, grade/mark submission, student evaluation.
- `STUDENT`: Self-service enrollment, attendance and transcript views, fee payment.
- `ACCOUNTANT`: Fee structure setup, payment recording, refund processing.
- `LIBRARIAN`: Student record verification.

### Method-Level Authorization
Enforced via `@EnableMethodSecurity(prePostEnabled = true)`:
```java
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
@PostMapping
public ResponseEntity<CollegeResponse> createCollege(...) { ... }
```

## 3. WebSocket Security
STOMP `CONNECT` frames are intercepted by `WebSocketConfig`'s `ChannelInterceptor`, extracting and validating the Bearer JWT token before permitting subscriptions to `/topic/*` or `/user/queue/*`.