# System Architecture Documentation

## 1. Overview
The **College Management System (CMS)** is an enterprise-grade multi-tier web application built on clean architecture, domain-driven design, and SOLID principles. It features a modular monolith backend in Spring Boot serving two independent, feature-equivalent single-page application frontends in React and Angular through a single unified REST API contract.

```
                          +-------------------+
                          |   Nginx Ingress   |
                          |   (:80 / :443)    |
                          +---------+---------+
                                    |
          +-------------------------+-------------------------+
          |                         |                         |
          v                         v                         v
+-------------------+     +-------------------+     +-------------------+
|  React Frontend   |     | Angular Frontend  |     | Spring Boot API   |
|   (Vite / :3000)  |     |  (CLI / :4200)    |     |   (Java 21 / :8080)
+-------------------+     +-------------------+     +---------+---------+
                                                              |
                                           +------------------+------------------+
                                           |                                     |
                                           v                                     v
                                 +-------------------+                 +-------------------+
                                 |   MySQL 8.0 DB    |                 |   Redis Cache     |
                                 |      (:3306)      |                 |      (:6379)      |
                                 +-------------------+                 +-------------------+
```

## 2. Core Architectural Layers

### Backend (Spring Boot 3.4 / Java 21)
- **Controller Layer (`module.*.controller`)**: Exposes RESTful endpoints, handles HTTP requests/responses, validates payloads via Jakarta Bean Validation (`@Valid`), documents APIs with OpenAPI / Swagger annotations. Thin controllers with zero business logic.
- **Service Layer (`module.*.service`)**: Encapsulates all domain and business rules, manages transactional boundaries (`@Transactional`), orchestrates cross-module interactions, and coordinates caching and asynchronous tasks.
- **Data Access Layer (`module.*.repository`)**: Spring Data JPA repositories with derived and custom JPQL queries, optimistic locking (`@Version`), and pagination/sorting capabilities.
- **Mapping Layer (`module.*.mapper`)**: MapStruct mappers compile-time generated to guarantee strict boundary isolation between persistence entities and API request/response DTOs.
- **Cross-Cutting Concerns**:
  - Centralized exception translation via `@RestControllerAdvice` emitting standardized `ApiError` envelopes.
  - Distributed request tracing through MDC logging filters (`MdcLogEnhancerFilter`).
  - Layered Redis caching (`RedisCacheManager`) with JSON serialization and graceful offline fallbacks.
  - Real-time STOMP WebSocket messaging (`/ws`) with token-authenticated message brokers.

### Frontends (Dual-Client Strategy)
- **React Frontend**: Vite, TypeScript, TanStack Query for server state management, React Hook Form + Zod, and Tailwind CSS.
- **Angular Frontend**: Standalone components, TypeScript, Angular Signals for reactive UI state, RxJS observables for async streams, Reactive Forms, and HttpClient interceptors.
- **Parity Guarantee**: Both frontends consume `/api/v1/*` identically, ensuring that switching frontends incurs zero backend modifications.