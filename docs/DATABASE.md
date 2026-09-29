# Database Architecture & Flyway Schema Design

The College Management System utilizes **MySQL 8.0** for relational persistence. Schema evolution is managed entirely through versioned **Flyway migrations** (`backend/src/main/resources/db/migration/`).

## 1. Migration History

| Version | Migration Script | Description |
|---|---|---|
| **V1** | `V1__create_users_and_auth.sql` | `users`, `roles`, `permissions`, `user_roles`, `role_permissions`, `refresh_tokens`, `login_history` |
| **V2** | `V2__create_organization.sql` | `colleges`, `departments` |
| **V3** | `V3__create_academic.sql` | `professors`, `courses`, `subjects`, `subject_assignments`, `students`, `student_profiles`, `guardians`, `student_documents`, `enrollments` |
| **V4** | `V4__create_attendance.sql` | `attendances` with unique date constraints per student and subject |
| **V5** | `V5__create_examination.sql` | `examinations`, `exam_subjects`, `grades`, `results` |
| **V6** | `V6__create_finance.sql` | `fee_structures`, `fee_invoices`, `payments`, `payment_transactions`, `refunds` |
| **V7** | `V7__create_notifications.sql` | `notifications`, `notification_preferences` |
| **V8** | `V8__create_audit_log.sql` | `audit_logs` tracking user actions, entity mutations, and trace IDs |
| **V9** | `V9__seed_initial_data.sql` | System seed data for standard roles, 36 granular permissions, role mappings, and 8 standard grade scales |

## 2. Key Design Standards
- **Surrogate Keys**: All tables use auto-incrementing `BIGINT PRIMARY KEY`.
- **Referential Integrity**: Foreign keys explicitly enforce relationships with appropriate cascading or restricted deletion rules.
- **Audit Columns**: Every table maintains `created_at` and `updated_at` timestamps.
- **Concurrency Control**: State-sensitive entities incorporate a `version BIGINT NOT NULL DEFAULT 0` column for JPA optimistic locking.
- **Indexing**: High-cardinality search columns (e.g. `roll_number`, `employee_id`, `email`, `code`, `status`) and all foreign keys have dedicated indexes.