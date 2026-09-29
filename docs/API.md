# REST API Contract & Endpoints

All APIs are versioned under the `/api/v1/` prefix.

## 1. Response & Error Envelopes

### Paginated Response Structure (`PageResponse<T>`)
```json
{
  "content": [...],
  "pageNumber": 0,
  "pageSize": 10,
  "totalElements": 42,
  "totalPages": 5,
  "last": false
}
```

### Standard Error Response (`ApiError`)
```json
{
  "timestamp": "2026-09-29T15:00:00Z",
  "status": 404,
  "code": "RESOURCE_NOT_FOUND",
  "message": "Student not found with id: 42",
  "path": "/api/v1/students/42",
  "traceId": "d8b3c10a-4bf7-4e6e-a320-b3bcfad58321",
  "validationErrors": null
}
```

## 2. API Route Summary

| Module | Base Path | Methods & Operations |
|---|---|---|
| **Authentication** | `/api/v1/auth` | `POST /login`, `POST /refresh-token`, `POST /logout`, `GET /me` |
| **Colleges** | `/api/v1/colleges` | CRUD, pagination, status toggling, search |
| **Departments** | `/api/v1/departments` | CRUD, pagination, college filtering, status toggling |
| **Professors** | `/api/v1/professors` | CRUD, department filtering, employee ID lookup, status updates |
| **Courses** | `/api/v1/courses` | CRUD, department filtering, degree type sorting |
| **Subjects** | `/api/v1/subjects` | CRUD, semester and course filtering, professor assignment |
| **Students** | `/api/v1/students` | CRUD, full-text JPQL search, enrollments, profile & guardian sub-resources |
| **Attendance** | `/api/v1/attendance` | `POST /batch`, `GET /student/{id}`, `GET /subject/{id}`, `GET /student/{id}/stats` |
| **Examinations** | `/api/v1/examinations` | Schedule management, exam subject allocation, status transitions |
| **Results** | `/api/v1/results` | Mark entries, automatic grade resolution, publishing, report cards |
| **Fees** | `/api/v1/fees` | Fee structures, invoices, payment simulation, receipts, refunds |
| **Notifications** | `/api/v1/notifications` | User alerts, unread counts, mark as read, preferences |
| **Dashboards** | `/api/v1/dashboard` | `GET /admin`, `GET /professor`, `GET /student` |
| **Audit Logs** | `/api/v1/audit-logs` | Administrative audit trail filtering |

## 3. Interactive Documentation
Access Swagger UI locally at: `http://localhost:8080/swagger-ui.html`
Raw OpenAPI JSON specification at: `http://localhost:8080/v3/api-docs`