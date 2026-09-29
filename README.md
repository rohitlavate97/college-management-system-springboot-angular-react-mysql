# Enterprise College Management System (CMS)

A production-grade, multi-tier College Management System built with a modular monolith architecture in **Java 21 / Spring Boot 3.4**, powered by **MySQL 8.0**, **Redis**, and dual feature-equivalent frontends in **React 18** and **Angular 18**.

---

> [!WARNING]
> **Production Security & Secret Rotation Notice (Check 01 - Gitleaks Compliance)**:
> Default credentials and placeholder JWT keys provided in local development configuration files (`application-dev.yml`, `.env.example`) must NEVER be used in production. Ensure that `${JWT_SECRET}`, `${DB_PASSWORD}`, and all database credentials are provided via secure environment variables or vault secret managers in production environments, and rotate any previously exposed secrets immediately.

---

## 🏛️ Architecture Overview
- **Backend:** Java 21 LTS, Spring Boot 3.4, Spring Data JPA, Spring Security, Flyway, JJWT 0.12.6, MapStruct, Redis Caching, STOMP WebSockets.
- **React Frontend:** React 18, TypeScript, Vite, TanStack Query, Axios, React Hook Form, Zod, Tailwind CSS.
- **Angular Frontend:** Standalone Angular 18, TypeScript, Angular Signals, RxJS, Reactive Forms, Tailwind CSS.
- **Infrastructure:** Multi-stage Dockerfiles, Nginx Reverse Proxy, Docker Compose, GitHub Actions CI/CD.

## 🚀 Quick Start
Run the complete stack with a single command:
```bash
docker compose up --build -d
```
- **React App**: http://localhost/
- **Angular App**: http://localhost/angular/
- **Backend API**: http://localhost/api/v1/
- **Swagger UI**: http://localhost:8080/swagger-ui.html

For detailed instructions, refer to **[LOCAL_SETUP.md](./LOCAL_SETUP.md)**.
For interview preparation and architectural deep-dives, see **[INTERVIEW_GUIDE.md](./INTERVIEW_GUIDE.md)**.