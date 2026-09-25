# Production-Grade College Management System — Master Build Prompt

## Role

You are a senior software architect, Java/Spring Boot engineer, database architect, React engineer, Angular engineer, DevOps engineer, and test automation engineer.

Your task is to **design and implement a production-ready, industry-style College Management System** from scratch.

This is not a demo CRUD application.

The project must be architected as a realistic enterprise application with:

- Spring Boot backend
- MySQL database
- React frontend
- Angular frontend
- REST APIs
- Authentication and authorization
- Role-based access control
- Validation
- Global exception handling
- DTO-based API contracts
- Database migrations
- Pagination, sorting and filtering
- Audit logging
- Caching
- Real-time notifications
- Automated tests
- Docker
- CI/CD
- API documentation
- Production-quality project structure

The most important learning requirement is:

> **There must be ONE backend/API and TWO independent frontend applications — React and Angular — consuming exactly the same APIs.**

The purpose is to allow the developer to learn Spring Boot, React and Angular simultaneously and compare how the same business functionality is implemented in each frontend framework.

---

# 1. NON-NEGOTIABLE DEVELOPMENT RULE

## Build the project COMMIT-WISE

Do NOT attempt to generate the entire project in one giant implementation.

The project must be developed incrementally.

Every meaningful functionality must be implemented, tested, verified and committed before moving to the next functionality.

The Git history should clearly show the evolution of the application.

Example:

```text
chore: initialize repository structure
feat: configure spring boot backend
feat: configure mysql and flyway
feat: implement department management
feat: implement professor management
feat: implement subject management
feat: implement student management
feat: implement authentication
feat: implement role based authorization
feat: implement enrollment management
feat: implement attendance management
feat: implement examination management
feat: implement result management
feat: implement fee management
feat: implement notifications
feat: add redis caching
feat: add websocket notifications
feat: initialize react frontend
feat: implement react authentication
feat: implement react student management
feat: initialize angular frontend
feat: implement angular authentication
feat: implement angular student management
test: add backend integration tests
test: add react e2e tests
test: add angular e2e tests
chore: dockerize application
ci: add github actions pipeline
docs: complete project documentation
```

### After EVERY completed functionality:

1. Implement it.
2. Compile/build it.
3. Run relevant tests.
4. Fix failures.
5. Verify the functionality.
6. Review the code.
7. Update documentation if required.
8. Create a Git commit.
9. Only then proceed to the next functionality.

Do NOT combine unrelated features into one commit.

Do NOT create fake commits.

Do NOT commit code that does not compile or has known failing tests unless explicitly documenting a temporary WIP commit is required.

---

# 2. FIRST STEP — INSPECT BEFORE MODIFYING

Before writing code:

1. Inspect the current repository.
2. Determine whether Git is already initialized.
3. Inspect existing files.
4. Inspect existing branches.
5. Inspect existing build configuration.
6. Inspect available Java, Node, npm, Maven and Angular/React tooling.
7. Determine whether the repository is empty or contains an existing project.
8. Do not delete or overwrite existing work without explicit justification.
9. Create a project implementation plan before coding.

If the repository is empty, initialize the required structure.

If Git is not initialized:

```bash
git init
```

Create an initial commit after establishing the repository baseline.

---

# 3. PROJECT OBJECTIVE

Build:

```text
College Management System
```

The system should manage:

- Colleges
- Departments
- Users
- Roles
- Permissions
- Students
- Student profiles
- Guardians
- Professors
- Subjects
- Courses
- Enrollments
- Professor subject assignments
- Attendance
- Examinations
- Exam schedules
- Results
- Grades
- Fee structures
- Fee invoices
- Payments
- Notifications
- Audit logs
- Dashboard/analytics

The initial ER diagram contains:

```text
Professor
Student
Subject
AdmissionRecord
```

Use that as the conceptual starting point, but expand it into a normalized production-oriented model.

Do NOT blindly copy the simple diagram.

Improve the domain model where necessary.

---

# 4. ARCHITECTURE

Use a **Modular Monolith** for the first production version.

Do NOT start with microservices.

The architecture should be:

```text
                         ┌───────────────────────┐
                         │       MySQL 8         │
                         └───────────┬───────────┘
                                     │
                         ┌───────────▼───────────┐
                         │    Spring Boot API    │
                         │                       │
                         │ REST API              │
                         │ Spring Security       │
                         │ JWT                   │
                         │ JPA / Hibernate       │
                         │ Validation            │
                         │ Flyway                │
                         │ Redis                 │
                         │ WebSocket             │
                         │ Audit Logging          │
                         └───────────┬───────────┘
                                     │
                       ┌─────────────┴─────────────┐
                       │                           │
              ┌────────▼────────┐        ┌────────▼────────┐
              │ React Frontend  │        │ Angular Frontend│
              │ TypeScript      │        │ TypeScript      │
              └─────────────────┘        └─────────────────┘
```

The React and Angular applications MUST consume the same REST APIs.

There must NOT be:

```text
/api/react/*
/api/angular/*
```

Use:

```text
/api/v1/*
```

for shared APIs.

---

# 5. TECHNOLOGY STACK

## Backend

Use:

```text
Java 21
Spring Boot 3.x
Spring Security
Spring Data JPA
Hibernate
MySQL 8
Flyway
Bean Validation
Redis
WebSocket
OpenAPI / Swagger
Maven
JUnit 5
Mockito
Testcontainers
REST Assured
```

Prefer current stable versions compatible with Java 21.

Before selecting exact dependency versions, verify compatibility using official documentation.

---

# 6. React FRONTEND

Use:

```text
React
TypeScript
Vite
React Router
TanStack Query
Axios
React Hook Form
Zod
```

Use a clean feature-based architecture.

Example:

```text
frontend-react/
└── src/
    ├── api/
    ├── components/
    ├── features/
    │   ├── auth/
    │   ├── students/
    │   ├── professors/
    │   ├── departments/
    │   ├── subjects/
    │   ├── enrollment/
    │   ├── attendance/
    │   ├── examination/
    │   ├── results/
    │   ├── fees/
    │   └── notifications/
    ├── hooks/
    ├── layouts/
    ├── routes/
    ├── types/
    └── utils/
```

---

# 7. ANGULAR FRONTEND

Use:

```text
Angular
TypeScript
Angular Router
HttpClient
RxJS
Angular Signals
Reactive Forms
```

Use a feature-based architecture.

Example:

```text
frontend-angular/
└── src/app/
    ├── core/
    ├── shared/
    ├── features/
    │   ├── auth/
    │   ├── students/
    │   ├── professors/
    │   ├── departments/
    │   ├── subjects/
    │   ├── enrollment/
    │   ├── attendance/
    │   ├── examination/
    │   ├── results/
    │   ├── fees/
    │   └── notifications/
    ├── layouts/
    └── services/
```

---

# 8. IMPORTANT FRONTEND LEARNING REQUIREMENT

React and Angular must implement equivalent screens and functionality.

For example:

```text
React                          Angular
------------------------------------------------
StudentList                    StudentList
StudentForm                    StudentForm
StudentDetails                 StudentDetails
StudentService                 StudentService
Authentication                 Authentication
Dashboard                      Dashboard
Attendance                     Attendance
Exam Results                   Exam Results
Fees                            Fees
Notifications                  Notifications
```

Both must communicate with:

```text
Spring Boot REST API
```

The business logic belongs in the backend.

Do not duplicate business rules independently in React and Angular.

---

# 9. DOMAIN MODEL

Design a normalized relational model around the following entities.

## Identity and security

```text
User
Role
Permission
RefreshToken
LoginHistory
```

## Organization

```text
College
Department
```

## Academic

```text
Student
StudentProfile
Guardian
StudentDocument
Professor
Subject
Course
Enrollment
SubjectAssignment
```

## Attendance

```text
Attendance
```

## Examination

```text
Examination
ExamSchedule
ExamSubject
Result
Grade
```

## Finance

```text
FeeStructure
FeeInvoice
Payment
PaymentTransaction
Refund
```

## Communication

```text
Notification
NotificationPreference
```

## Auditing

```text
AuditLog
```

Do not add tables merely for complexity.

Every entity must have a clear business purpose.

---

# 10. IMPORTANT JPA RELATIONSHIP DESIGN

Avoid unnecessary direct `ManyToMany` mappings.

Prefer explicit relationship entities.

For example:

```text
Student
   |
   | 1:N
   |
Enrollment
   |
   | N:1
   |
Subject
```

and:

```text
Professor
   |
   | 1:N
   |
SubjectAssignment
   |
   | N:1
   |
Subject
```

This allows additional attributes such as:

```text
academicYear
semester
assignedDate
status
```

when required.

Carefully distinguish:

- Domain ownership
- JPA ownership
- Database foreign-key ownership

Document these decisions.

---

# 11. DATABASE REQUIREMENTS

Use:

```text
MySQL 8
Flyway
```

Never rely on Hibernate auto-generating the production schema.

Use versioned migrations:

```text
V1__create_users.sql
V2__create_roles.sql
V3__create_permissions.sql
V4__create_departments.sql
...
```

Requirements:

- Primary keys
- Foreign keys
- Unique constraints
- NOT NULL constraints
- Appropriate indexes
- Created/updated timestamps
- Optimistic locking where appropriate
- Proper naming conventions
- Referential integrity
- Soft deletion only where it has a legitimate business purpose

Avoid unnecessary database normalization/denormalization.

Document important indexing decisions.

---

# 12. API DESIGN

All APIs must use:

```text
/api/v1/
```

Example:

```text
/api/v1/auth
/api/v1/students
/api/v1/professors
/api/v1/departments
/api/v1/subjects
/api/v1/enrollments
/api/v1/attendance
/api/v1/examinations
/api/v1/results
/api/v1/fees
/api/v1/notifications
/api/v1/dashboard
```

Implement:

```text
GET
POST
PUT
PATCH
DELETE
```

where appropriate.

Support:

```text
Pagination
Sorting
Filtering
Searching
Validation
Consistent error responses
```

Example:

```http
GET /api/v1/students?page=0&size=20&sort=lastName,asc
```

Example filtering:

```http
GET /api/v1/students?department=CS&status=ACTIVE
```

---

# 13. DTO ARCHITECTURE

Never expose JPA entities directly through REST APIs.

Use:

```text
Entity
   ↓
Repository
   ↓
Service
   ↓
Mapper
   ↓
Response DTO
   ↓
Controller
```

Example:

```text
StudentRequest
StudentResponse
StudentSummaryResponse
StudentSearchResponse
```

Use DTOs for request and response models.

Avoid circular JSON serialization problems by design rather than by randomly adding Jackson annotations.

---

# 14. SERVICE LAYER

Controllers should be thin.

Bad:

```java
@PostMapping
public Student createStudent(...) {
    // business logic
}
```

Preferred:

```text
Controller
    ↓
Service
    ↓
Repository
```

Business rules must live in the service/domain layer.

Use transactions deliberately:

```java
@Transactional
```

Do not place `@Transactional` everywhere without understanding transaction boundaries.

---

# 15. SECURITY

Implement production-style authentication.

Requirements:

```text
Spring Security
JWT access token
Refresh token
Password hashing
Role-based authorization
Method-level authorization
CORS configuration
Authentication failure handling
Authorization failure handling
Account status
```

Roles:

```text
SUPER_ADMIN
ADMIN
HOD
PROFESSOR
STUDENT
ACCOUNTANT
LIBRARIAN
```

Example:

```java
@PreAuthorize("hasRole('ADMIN')")
```

Do not hardcode authorization logic throughout controllers.

Use a consistent authorization model.

---

# 16. PASSWORD SECURITY

Never store plaintext passwords.

Use a modern password hashing mechanism supported by Spring Security.

Do not log:

```text
password
JWT
refresh token
OTP
payment credentials
```

Sensitive information must never appear in application logs.

---

# 17. GLOBAL ERROR HANDLING

Implement:

```text
@RestControllerAdvice
```

Handle:

```text
ResourceNotFoundException
ValidationException
DuplicateResourceException
UnauthorizedException
ForbiddenException
BusinessException
DataIntegrityViolationException
```

Use a consistent error structure:

```json
{
  "timestamp": "2026-09-25T18:30:00Z",
  "status": 404,
  "code": "STUDENT_NOT_FOUND",
  "message": "Student with id 105 was not found",
  "path": "/api/v1/students/105",
  "traceId": "..."
}
```

Do not expose stack traces or internal database errors to clients.

---

# 18. VALIDATION

Use Jakarta Bean Validation.

Examples:

```text
@NotBlank
@NotNull
@Email
@Size
@Pattern
@Positive
```

Create custom validators where business requirements genuinely need them.

Validation errors must be returned consistently.

---

# 19. STUDENT MODULE

Implement:

```text
Create student
Update student
View student
Delete/deactivate student
Search students
Filter students
Pagination
Sorting
Student profile
Guardian
Documents
Admission
Enrollment
```

API examples:

```text
POST   /api/v1/students
GET    /api/v1/students
GET    /api/v1/students/{id}
PUT    /api/v1/students/{id}
PATCH  /api/v1/students/{id}/status
DELETE /api/v1/students/{id}
GET    /api/v1/students/search
```

---

# 20. PROFESSOR MODULE

Implement:

```text
Professor CRUD
Department assignment
Subject assignment
Professor status
Professor search
Pagination
Filtering
```

Use explicit:

```text
SubjectAssignment
```

relationship.

---

# 21. SUBJECT MODULE

Implement:

```text
Subject CRUD
Department relationship
Course relationship
Professor assignment
Student enrollment
Search
Pagination
Sorting
Filtering
```

---

# 22. ENROLLMENT MODULE

Implement:

```text
Student enrollment
Subject enrollment
Academic year
Semester
Enrollment status
Drop/withdraw functionality
```

Statuses:

```text
ACTIVE
DROPPED
COMPLETED
CANCELLED
```

Do not allow invalid enrollment states.

Use service-layer business validation.

---

# 23. ATTENDANCE MODULE

Implement:

```text
Mark attendance
Update attendance
View attendance
Student attendance summary
Subject attendance summary
Professor attendance workflow
Attendance percentage
```

Statuses:

```text
PRESENT
ABSENT
LATE
EXCUSED
```

Support date-based queries.

Example:

```text
GET /api/v1/attendance/student/{studentId}
GET /api/v1/attendance/subject/{subjectId}
```

---

# 24. EXAMINATION MODULE

Implement:

```text
Create examination
Schedule examination
Assign subjects
Publish examination
View schedule
```

---

# 25. RESULT MODULE

Implement:

```text
Enter marks
Update marks
Calculate grade
Publish result
View student results
Result summary
```

Do not allow students to edit their own results.

Use role-based authorization.

---

# 26. FEES MODULE

Implement:

```text
Fee structure
Fee invoice
Payment
Payment status
Payment transaction
Refund
Receipt
Outstanding amount
```

Statuses:

```text
PENDING
PARTIALLY_PAID
PAID
FAILED
REFUNDED
```

For the first version, use a mock payment provider.

Do not integrate real financial credentials.

---

# 27. NOTIFICATION SYSTEM

Implement:

```text
Notification
NotificationPreference
```

Notification types can include:

```text
ATTENDANCE
EXAM
RESULT
FEE
ANNOUNCEMENT
SYSTEM
```

Support:

```text
REST notification retrieval
WebSocket real-time delivery
Unread count
Mark as read
```

---

# 28. REAL-TIME FUNCTIONALITY

Implement actual real-time functionality.

Example:

```text
Professor marks attendance
        ↓
Spring Boot
        ↓
Domain/application event
        ↓
WebSocket
        ↓
React + Angular
        ↓
Notification appears without page refresh
```

Use WebSocket/STOMP or another appropriate Spring-supported approach.

Document the architecture.

---

# 29. REDIS

Use Redis only for meaningful use cases.

Potential uses:

```text
Caching
Rate limiting
Temporary authentication data
Notification/pub-sub
Frequently accessed dashboard data
```

Implement cache invalidation carefully.

Do not add Redis merely for resume keywords.

---

# 30. AUDIT LOGGING

Implement an audit system.

Record important actions:

```text
LOGIN
CREATE
UPDATE
DELETE
ROLE_CHANGE
FEE_PAYMENT
RESULT_PUBLISHED
ATTENDANCE_UPDATED
```

Store:

```text
user
action
entity
entityId
timestamp
IP/address where appropriate
request correlation ID
```

Never store passwords or tokens.

---

# 31. OBSERVABILITY

Implement:

```text
Spring Boot Actuator
Structured logging
Correlation/trace ID
Health endpoints
Application metrics
```

Prepare the architecture for:

```text
Prometheus
Grafana
```

Do not expose sensitive actuator endpoints publicly.

---

# 32. API DOCUMENTATION

Use OpenAPI/Swagger.

Document:

- Authentication
- Request bodies
- Response bodies
- Validation errors
- HTTP status codes
- Authorization requirements
- Pagination
- Filtering
- Sorting

The API documentation should be usable by both frontend teams.

---

# 33. TESTING STRATEGY

The project must have multiple testing layers.

## Unit tests

Use:

```text
JUnit 5
Mockito
```

Test service/business logic.

## Repository tests

Test:

```text
JPA queries
constraints
relationships
```

## Controller tests

Use:

```text
MockMvc
```

## Integration tests

Use:

```text
Testcontainers
MySQL
Redis
```

Avoid relying exclusively on H2 when MySQL-specific behavior matters.

## API tests

Use:

```text
REST Assured
```

## Frontend tests

Use the appropriate testing stack for React and Angular.

## E2E

Use:

```text
Playwright
```

The same business workflows should be tested against both frontend applications.

---

# 34. QA / AUTOMATION

Create end-to-end workflows such as:

```text
Admin logs in
    ↓
Creates department
    ↓
Creates professor
    ↓
Creates subject
    ↓
Creates student
    ↓
Enrolls student
    ↓
Professor marks attendance
    ↓
Student views attendance
    ↓
Exam is created
    ↓
Result is entered
    ↓
Student views result
    ↓
Fee invoice is generated
    ↓
Payment is completed
    ↓
Student sees updated fee status
```

Automate these workflows.

---

# 35. REACT IMPLEMENTATION

React must implement:

```text
Login
Dashboard
Student list
Student create/edit
Student details
Professor management
Department management
Subject management
Enrollment
Attendance
Examination
Results
Fees
Notifications
Profile
```

Use:

```text
React Router
TanStack Query
Axios
React Hook Form
Zod
```

Use reusable components.

Avoid putting everything in one giant component.

---

# 36. ANGULAR IMPLEMENTATION

Angular must implement the equivalent functionality:

```text
Login
Dashboard
Student list
Student create/edit
Student details
Professor management
Department management
Subject management
Enrollment
Attendance
Examination
Results
Fees
Notifications
Profile
```

Use:

```text
Angular Router
HttpClient
RxJS
Signals
Reactive Forms
Guards
Interceptors
Services
```

Do not simply copy React code conceptually.

Implement idiomatic Angular patterns.

---

# 37. FRONTEND AUTHENTICATION

Both frontends must implement:

```text
Login
Logout
Token handling
Protected routes
Role-based UI
Unauthorized handling
Token refresh
```

Do not duplicate sensitive authorization decisions exclusively in the frontend.

Backend authorization is authoritative.

---

# 38. DASHBOARDS

Implement different dashboards.

## Admin

```text
Students
Professors
Departments
Revenue
Pending Fees
Attendance statistics
Recent admissions
```

## Professor

```text
Assigned subjects
Today's classes
Attendance
Upcoming exams
Student performance
```

## Student

```text
Subjects
Attendance
Results
Fees
Announcements
Notifications
```

---

# 39. UI REQUIREMENTS

The application should look like a professional college ERP, not a tutorial application.

Requirements:

```text
Responsive design
Desktop support
Tablet support
Mobile-friendly layouts
Loading states
Empty states
Error states
Confirmation dialogs
Form validation
Toast notifications
Accessible forms
Pagination
Search
Filtering
Sorting
```

Use a consistent design system.

Avoid excessive visual complexity.

---

# 40. DOCKER

Create Docker configurations for:

```text
Backend
React
Angular
MySQL
Redis
Nginx
```

Create:

```text
docker-compose.yml
```

for local development.

The project should be possible to start with a documented command such as:

```bash
docker compose up --build
```

---

# 41. CI/CD

Create GitHub Actions workflows.

Pipeline should include:

```text
Checkout
↓
Build backend
↓
Run unit tests
↓
Run integration tests
↓
Build React
↓
Build Angular
↓
Run frontend tests
↓
Run quality checks
↓
Build Docker images
```

Do not add deployment credentials to the repository.

Use GitHub Secrets.

---

# 42. CODE QUALITY

Follow:

```text
SOLID
DRY
KISS
Clean Code
Separation of Concerns
Dependency Injection
REST principles
Database normalization
Secure coding practices
```

Avoid:

```text
God classes
God controllers
Massive services
Duplicated business logic
Magic strings
Hardcoded credentials
Hardcoded URLs
Entity exposure
Unnecessary abstractions
Premature microservices
```

---

# 43. CONFIGURATION

Use environment-specific configuration.

For example:

```text
application.yml
application-dev.yml
application-test.yml
application-prod.yml
```

Sensitive configuration must come from environment variables/secrets.

Never commit:

```text
database passwords
JWT secrets
API keys
cloud credentials
payment credentials
```

Provide:

```text
.env.example
```

where useful.

---

# 44. LOGGING

Implement meaningful structured logging.

Logs should help answer:

```text
What happened?
Who performed it?
When?
Which request?
Which entity?
What failed?
```

Use correlation IDs.

Never log sensitive credentials.

---

# 45. DOCUMENTATION

Maintain:

```text
README.md
ARCHITECTURE.md
DATABASE.md
API.md
SECURITY.md
TESTING.md
DEPLOYMENT.md
DEVELOPMENT.md
```

Update documentation as features are completed.

Do not leave documentation until the final commit.

---

# 46. COMMIT STRATEGY

Every commit should be small enough to understand.

Use Conventional Commits.

Examples:

```text
chore: initialize project repository
chore: configure spring boot application
feat: configure mysql database
feat: add flyway migrations
feat: implement department management
feat: implement professor management
feat: implement subject management
feat: implement student management
feat: implement authentication
feat: implement jwt authorization
test: add student service tests
test: add student integration tests
feat: initialize react frontend
feat: implement react authentication
feat: implement react student module
feat: initialize angular frontend
feat: implement angular authentication
feat: implement angular student module
feat: implement websocket notifications
feat: add redis caching
chore: add docker compose environment
ci: add github actions pipeline
docs: complete architecture documentation
```

Before each commit:

```bash
git status
git diff
git diff --cached
```

Then commit.

After committing:

```bash
git status
git log -1 --oneline
```

The working tree should be clean unless there is a clearly documented reason.

---

# 47. COMMIT CHECKPOINT FORMAT

After each functionality, report:

```text
==================================================
COMPLETED CHECKPOINT
==================================================

Feature:
Department Management

Implemented:
- Department entity
- Repository
- Service
- DTOs
- Mapper
- Controller
- Validation
- Exception handling
- Flyway migration
- Unit tests
- Integration tests
- API documentation

Verification:
- Maven build: PASS
- Unit tests: PASS
- Integration tests: PASS
- API verification: PASS

Commit:
feat: implement department management

Git status:
CLEAN

Next:
Professor Management
==================================================
```

Do this internally and in your progress response.

---

# 48. DO NOT MOVE AHEAD IF A CHECKPOINT FAILS

If:

```text
Build fails
Test fails
Migration fails
API fails
Frontend compilation fails
Lint fails
```

STOP.

Fix the problem first.

Then rerun verification.

Only create the commit after the checkpoint passes.

---

# 49. DEVELOPMENT ORDER

Follow this approximate order.

## Phase 0 — Repository

```text
Git initialization
README
Project directories
Architecture documentation
```

Commit.

## Phase 1 — Backend foundation

```text
Spring Boot
Maven
Configuration
Logging
Exception handling
Validation
OpenAPI
Actuator
```

Commit after each meaningful completed feature.

## Phase 2 — Database

```text
MySQL
Flyway
Initial schema
Indexes
Constraints
```

Commit.

## Phase 3 — Organization

```text
College
Department
```

Commit each completed module.

## Phase 4 — Academic

```text
Professor
Subject
Course
Student
```

Commit each module.

## Phase 5 — Authentication

```text
User
Role
Permission
JWT
Refresh tokens
RBAC
```

Commit each meaningful functionality.

## Phase 6 — Student lifecycle

```text
Admission
Profile
Guardian
Documents
Enrollment
```

Commit each functionality.

## Phase 7 — Attendance

```text
Attendance
Statistics
```

Commit.

## Phase 8 — Examination

```text
Examination
ExamSchedule
Results
Grades
```

Commit.

## Phase 9 — Fees

```text
FeeStructure
Invoice
Payment
Transaction
Refund
```

Commit.

## Phase 10 — React

Implement React feature-by-feature.

Commit every completed feature.

## Phase 11 — Angular

Implement Angular feature-by-feature.

Commit every completed feature.

## Phase 12 — Redis

Implement caching/rate limiting/appropriate Redis use cases.

Commit each meaningful functionality.

## Phase 13 — WebSocket

Implement real-time notifications.

Commit.

## Phase 14 — Testing

Backend:

```text
Unit
Integration
API
```

Frontend:

```text
Component
Integration
E2E
```

Commit meaningful test groups.

## Phase 15 — Docker

Commit.

## Phase 16 — CI/CD

Commit.

## Phase 17 — Observability

Commit.

## Phase 18 — Documentation

Commit.

---

# 50. IMPORTANT: DO NOT OVERENGINEER

This is intended to become a serious portfolio/interview project.

However:

Do NOT add technologies simply because they sound enterprise-grade.

For example:

```text
Kafka
Kubernetes
Microservices
Elasticsearch
MongoDB
GraphQL
Kafka Streams
Service Mesh
```

should NOT be added unless there is a real architectural reason.

First create a strong modular monolith.

After the core system works, optional advanced architecture can be introduced.

---

# 51. OPTIONAL VERSION 2

After Version 1 is fully functional, create an architectural evolution plan.

Potential extraction:

```text
API Gateway
Auth Service
Student Service
Academic Service
Finance Service
Notification Service
```

Potential infrastructure:

```text
Kafka
Service Discovery
Config Server
Kubernetes
```

But this must be treated as Version 2.

Do not compromise Version 1 by prematurely introducing microservices.

---

# 52. API-FIRST DEVELOPMENT

For each feature:

```text
1. Database model
2. Migration
3. Entity
4. Repository
5. Service
6. DTO
7. Mapper
8. Controller
9. Validation
10. Exception handling
11. Tests
12. Swagger documentation
13. API verification
14. Commit
15. React implementation
16. React tests
17. Commit
18. Angular implementation
19. Angular tests
20. Commit
```

This sequence should be followed consistently.

---

# 53. REACT VS ANGULAR LEARNING

For each feature, document the equivalent implementation.

Example:

```text
Student List

React:
- Component
- Hook
- Query
- Form
- Router
- Error handling

Angular:
- Component
- Service
- Observable/Signal
- Reactive Form
- Router
- Interceptor
- Error handling
```

Create documentation such as:

```text
docs/frontend/react-vs-angular.md
```

This should explain conceptual differences without claiming one framework is universally better.

---

# 54. DATABASE ER DIAGRAM

Maintain an updated ER diagram.

The final model should clearly represent:

```text
College
Department
Professor
Student
Subject
Course
Enrollment
SubjectAssignment
Attendance
Examination
ExamSchedule
Result
Grade
FeeStructure
FeeInvoice
Payment
Notification
User
Role
Permission
AuditLog
```

Whenever the schema changes significantly, update the diagram/documentation.

---

# 55. PERFORMANCE

Implement reasonable production practices:

```text
Database indexes
Pagination
Lazy loading where appropriate
Avoid N+1 queries
Entity graphs/fetch joins where appropriate
Caching
Connection pooling
Efficient DTO projections where useful
```

Do not optimize blindly.

Measure or reason about actual bottlenecks.

---

# 56. SECURITY REVIEW

Before final completion, perform a security review covering:

```text
Authentication
Authorization
Password storage
JWT handling
Refresh token handling
CORS
CSRF considerations
SQL injection
Mass assignment
IDOR
Sensitive data exposure
Logging
Secrets
Rate limiting
Input validation
File upload security
```

Document findings and fixes.

---

# 57. FINAL ACCEPTANCE CRITERIA

The project is considered complete only when:

### Backend

```text
[ ] Spring Boot builds successfully
[ ] MySQL works
[ ] Flyway migrations work
[ ] Authentication works
[ ] RBAC works
[ ] DTO architecture implemented
[ ] Validation implemented
[ ] Global exception handling implemented
[ ] Pagination implemented
[ ] Sorting implemented
[ ] Filtering implemented
[ ] Audit logging implemented
[ ] Redis implemented where appropriate
[ ] WebSocket implemented
[ ] OpenAPI documentation works
[ ] Actuator works
[ ] Unit tests pass
[ ] Integration tests pass
[ ] API tests pass
```

### React

```text
[ ] React builds successfully
[ ] Authentication works
[ ] Protected routes work
[ ] Student management works
[ ] Professor management works
[ ] Subject management works
[ ] Enrollment works
[ ] Attendance works
[ ] Examination works
[ ] Results work
[ ] Fees work
[ ] Notifications work
[ ] Dashboard works
[ ] E2E tests pass
```

### Angular

```text
[ ] Angular builds successfully
[ ] Authentication works
[ ] Guards work
[ ] Interceptors work
[ ] Student management works
[ ] Professor management works
[ ] Subject management works
[ ] Enrollment works
[ ] Attendance works
[ ] Examination works
[ ] Results work
[ ] Fees work
[ ] Notifications work
[ ] Dashboard works
[ ] E2E tests pass
```

### DevOps

```text
[ ] Docker works
[ ] Docker Compose works
[ ] GitHub Actions works
[ ] Environment configuration documented
[ ] Production configuration documented
```

### Documentation

```text
[ ] README complete
[ ] Architecture documented
[ ] Database documented
[ ] API documented
[ ] Security documented
[ ] Testing documented
[ ] Deployment documented
[ ] React vs Angular comparison documented
```

---

# 58. FINAL GIT HISTORY REQUIREMENT

The final repository must have a meaningful Git history.

Do NOT squash everything into one commit.

The commit history should allow another developer to understand:

```text
What was built?
When was it built?
Why was it built?
Which functionality was added?
Which tests were added?
Which architectural decision was made?
```

Each commit should represent a coherent, working increment.

---

# 59. IMPORTANT AGENT BEHAVIOR

When working on this project:

1. Think before coding.
2. Inspect existing code before modifying it.
3. Follow the architecture consistently.
4. Implement one coherent functionality at a time.
5. Test it.
6. Verify it.
7. Commit it.
8. Then continue.
9. Do not silently skip failed tests.
10. Do not fabricate successful test results.
11. Do not claim a feature is implemented unless it actually exists.
12. Do not create placeholder code and call it production-ready.
13. Do not use TODOs as substitutes for required implementation.
14. Do not overwrite user work without confirmation.
15. Do not expose secrets.
16. Keep React and Angular API contracts identical.
17. Keep business logic in Spring Boot.
18. Prefer maintainable code over clever code.
19. Explain important architectural decisions.
20. Keep the Git history clean and meaningful.

---

# 60. START HERE

Before implementing anything:

### Step 1

Inspect the repository.

### Step 2

Inspect the Git state.

### Step 3

Inspect available development tools.

### Step 4

Create the architecture and implementation plan.

### Step 5

Create the initial project structure.

### Step 6

Create the first commit.

### Step 7

Begin Phase 1.

Do NOT implement the entire project in a single operation.

Proceed incrementally and maintain a working application after every checkpoint.

---

# FINAL PRINCIPLE

The goal is not merely to produce source code.

The goal is to create a **realistic enterprise-style College Management System that can be studied feature-by-feature**.

The developer should be able to understand:

```text
Database Design
       ↓
Spring Boot
       ↓
REST API
       ↓
Security
       ↓
Business Logic
       ↓
React
       ↓
Angular
       ↓
Testing
       ↓
Docker
       ↓
CI/CD
       ↓
Production Deployment
```

The same backend must power both frontends.

The entire project must evolve through **small, tested, understandable Git commits**.

Every completed functionality must leave the repository in a working state before moving forward.
