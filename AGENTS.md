# Agent Team Architecture & Operating Guidelines

This project employs a team of specialized AI agents designed to build, test, and maintain the College Management System according to enterprise standards and the master prompt instructions.

## The Agent Team

| Agent | Type Name | Role | Scope & Responsibilities |
|---|---|---|---|
| **Backend Architect** | `BackendArchitect` | Spring Boot & API Architect | Java 21, Spring Boot 3.x, Data JPA, Spring Security, Flyway, DTO design, MapStruct mappers, global exception handling, validation, controllers. |
| **Database Architect** | `DatabaseArchitect` | Database & Migration Engineer | MySQL 8 schema design, Flyway versioned migrations (V1..V9+), indexes, constraints, ER diagram maintenance, referential integrity. |
| **React Engineer** | `ReactEngineer` | React Frontend Developer | React, TypeScript, Vite, React Router, TanStack Query, Axios, React Hook Form, Zod, responsive UI, accessible design. |
| **Angular Engineer** | `AngularEngineer` | Angular Frontend Developer | Angular (latest stable), TypeScript, Angular Router, HttpClient, RxJS, Angular Signals, Reactive Forms, Guards, Interceptors. |
| **DevOps Engineer** | `DevOpsEngineer` | Infrastructure & CI/CD Engineer | Dockerfiles, Docker Compose, Nginx reverse proxy, GitHub Actions CI/CD workflows, environment configuration (.env.example). |
| **QA / Automation Engineer** | `QAEngineer` | Quality Assurance & Test Engineer | JUnit 5 unit tests, MockMvc controller tests, Testcontainers integration tests, REST Assured API tests, Playwright E2E tests. |

---

## Agent Definitions & Profiles

Detailed instructions and prompt templates for each agent are stored in the [`agents/`](./agents/) directory:

- [Backend Architect Specification](./agents/backend-architect.md)
- [Database Architect Specification](./agents/database-architect.md)
- [React Engineer Specification](./agents/react-engineer.md)
- [Angular Engineer Specification](./agents/angular-engineer.md)
- [DevOps Engineer Specification](./agents/devops-engineer.md)
- [QA Engineer Specification](./agents/qa-engineer.md)

---

## Non-Negotiable Operational Principles

1. **Commit-Wise Incremental Development**: Every feature must be implemented, compiled, verified, and committed before moving to the next.
2. **Single API Contract, Dual Frontends**: One Spring Boot REST backend (`/api/v1/*`) serving both React and Angular frontends identically.
3. **DTO Separation**: Never expose JPA entities directly to API consumers.
4. **Encoding Standard**: All source files must be saved in UTF-8 without BOM.
5. **No God Classes**: Adhere to SOLID, DRY, and clean architecture boundaries.
