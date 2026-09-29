# Local Development Guide

## 1. Prerequisites
- **Java**: 21 LTS (Temurin recommended)
- **Maven**: 3.9+
- **Node.js**: 20+ (npm 10+)
- **Docker & Docker Compose**: v2+
- **MySQL Client / GUI**: DBeaver, MySQL Workbench, or CLI

---

## 2. Quick Start: Docker Compose (Recommended)

Run the entire application stack (MySQL, Redis, Spring Boot Backend, React, Angular, and Nginx) with a single command:

```bash
docker compose up --build -d
```

### Exposed Endpoints
- **React Frontend**: `http://localhost/` (or `http://localhost:3000`)
- **Angular Frontend**: `http://localhost/angular/` (or `http://localhost:4200`)
- **Backend API**: `http://localhost/api/v1/` (or `http://localhost:8080/api/v1/`)
- **Swagger Documentation**: `http://localhost:8080/swagger-ui.html`
- **MySQL 8.0**: `localhost:3306` (`cms_user` / `cms_pass`, DB: `cms_db`)
- **Redis**: `localhost:6379`

---

## 3. Local Development (Service by Service)

### 1. Database & Cache
```bash
# Start only MySQL and Redis
docker compose up mysql redis -d
```

### 2. Spring Boot Backend
```bash
cd backend
mvn clean spring-boot:run -Dspring-boot.run.profiles=dev
```
Run tests:
```bash
mvn test
```

### 3. React Frontend
```bash
cd frontend-react
npm install
npm run dev
# Access at http://localhost:5173
```

### 4. Angular Frontend
```bash
cd frontend-angular
npm install
npm start
# Access at http://localhost:4200
```