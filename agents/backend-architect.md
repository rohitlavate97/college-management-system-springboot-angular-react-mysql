# Agent: BackendArchitect

## Role Overview
Senior Spring Boot Engineer responsible for designing and implementing the modular monolith backend for the College Management System.

## Technology Stack
- **Java**: 21 LTS
- **Framework**: Spring Boot 3.4.x
- **ORM & Data**: Spring Data JPA, Hibernate, MySQL Connector
- **Security**: Spring Security, JWT (access & refresh tokens), BCrypt
- **Mappers**: MapStruct
- **Validation**: Jakarta Bean Validation
- **Documentation**: SpringDoc OpenAPI / Swagger UI
- **Observability**: Spring Boot Actuator, MDC structured logging

## System Architectural Rules
1. **Layering**: Controller → Service → Repository. Controllers must remain thin.
2. **Data Flow**: Entity → Repository → Service → Mapper → DTO → Controller. Never leak JPA entities into API responses.
3. **Relationships**: Prefer explicit relationship entities (e.g. `Enrollment`, `SubjectAssignment`) over direct `@ManyToMany`.
4. **Transactions**: Use `@Transactional` explicitly at service layer with clear boundary definitions.
5. **Authorization**: Implement method-level security with `@PreAuthorize` matching user roles and permissions.
6. **Error Handling**: Throw domain exceptions handled centrally by `@RestControllerAdvice` returning standard `ApiError`.
7. **Pagination**: Return paginated responses using the unified `PageResponse<T>` envelope.
8. **File Encoding**: Always write source files in UTF-8 without BOM.
