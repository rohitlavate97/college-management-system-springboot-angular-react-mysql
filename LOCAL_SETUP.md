# Local Development & Setup Guide: College Management System

This guide provides end-to-end instructions for running, testing, and debugging the **College Management System** on your local machine.

---

## 📋 System Prerequisites

Ensure you have the following installed on your development machine:

| Software | Minimum Version | Recommended Version | Verification Command |
|---|---|---|---|
| **Git** | 2.30+ | Latest | `git --version` |
| **Java Development Kit (JDK)** | 21 LTS | Eclipse Temurin 21 | `java -version` |
| **Apache Maven** | 3.9+ | 3.9.6+ | `mvn -v` |
| **Node.js & npm** | 20 LTS | Node 20.x, npm 10+ | `node -v` && `npm -v` |
| **Docker & Docker Compose** | v2.20+ | Docker Desktop v4+ | `docker compose version` |

> [!TIP]
> **Windows Users**: If running npm or Angular commands fails in PowerShell due to execution policy, run:
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
> ```

---

## 🚀 Option 1: 1-Command Startup with Docker Compose (Recommended)

This is the fastest way to spin up the entire multi-service stack (**MySQL 8.0**, **Redis**, **Spring Boot Backend**, **React Frontend**, **Angular Frontend**, and **Nginx Reverse Proxy**).

### 1. Clone & Navigate
```bash
git clone https://github.com/rohitlavate97/college-management-system-springboot-angular-react-mysql.git
cd college-management-system-springboot-angular-react-mysql
```

### 2. Configure Environment
Copy the sample environment file:
```bash
cp .env.example .env
```
*(On Windows PowerShell: `Copy-Item .env.example .env`)*

### 3. Launch the Application Stack
```bash
docker compose up --build -d
```

### 4. Verify Running Services
```bash
docker compose ps
```
All containers (`cms-mysql`, `cms-redis`, `cms-backend`, `cms-react`, `cms-angular`, and `cms-nginx`) should show status `Up` / `healthy`.

### 5. Access the Applications
| Service | URL | Notes |
|---|---|---|
| **React Frontend** | [http://localhost/](http://localhost/) | Main web application (SPA) |
| **Angular Frontend** | [http://localhost/angular/](http://localhost/angular/) | Feature-equivalent Angular client |
| **Backend REST API** | [http://localhost/api/v1/](http://localhost/api/v1/) | Direct backend access |
| **Swagger UI / OpenAPI** | [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) | Interactive API documentation |
| **WebSocket Endpoint** | `ws://localhost/ws` | Real-time STOMP messaging |
| **MySQL Database** | `localhost:3306` | User: `cms_user`, Password: `cms_pass`, DB: `cms_db` |
| **Redis Cache** | `localhost:6379` | In-memory key-value store |

### 6. View Logs & Stop Stack
```bash
# View backend logs in real time
docker compose logs -f backend

# Stop all containers
docker compose down

# Stop and wipe database/cache volumes for a clean reset
docker compose down -v
```

---

## 🛠️ Option 2: Running Natively for Local Development (Hybrid Mode)

If you are developing or debugging code in an IDE (IntelliJ IDEA, VS Code, Eclipse), follow this setup:

### Step 1: Start Database & Cache Containers
Instead of running MySQL and Redis directly on your host, use Docker for just the data layer:
```bash
docker compose up mysql redis -d
```
Verify MySQL and Redis are healthy:
```bash
docker compose ps mysql redis
```

### Step 2: Run the Spring Boot Backend
1. Open the project in your IDE or terminal.
2. Navigate to `backend/`:
   ```bash
   cd backend
   ```
3. Run with Maven (Flyway will automatically execute migrations `V1` through `V9` on startup):
   ```bash
   mvn clean spring-boot:run -Dspring-boot.run.profiles=dev
   ```
4. Verify the backend is up:
   - Actuator Health: [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health)
   - Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

### Step 3: Run the React Frontend
1. Open a new terminal and navigate to `frontend-react/`:
   ```bash
   cd frontend-react
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access React at: [http://localhost:5173](http://localhost:5173) (Vite proxies `/api` calls directly to `http://localhost:8080`).

### Step 4: Run the Angular Frontend
1. Open a new terminal and navigate to `frontend-angular/`:
   ```bash
   cd frontend-angular
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Angular development server:
   ```bash
   npm start
   ```
4. Access Angular at: [http://localhost:4200](http://localhost:4200) (Configured via `proxy.conf.json` to proxy `/api` calls to `http://localhost:8080`).

---

## 🧪 Running Automated Tests

### 1. Backend Automated Tests (JUnit 5 & MockMvc)
```bash
cd backend
mvn test
```
*Executes all 30 unit, service, controller, and global exception handling tests.*

### 2. React Frontend Production Build Verification
```bash
cd frontend-react
npm run build
```
*Validates TypeScript compilation and generates production bundles in `dist/`.*

### 3. Angular Frontend Production Build Verification
```bash
cd frontend-angular
npm run build
```
*Validates Angular template diagnostics and produces optimized bundles in `dist/frontend-angular/`.*

---

## 🔑 Default Seed Data & Test Accounts

Flyway migration `V9__seed_initial_data.sql` pre-seeds standard roles and grades:
- **Roles**: `SUPER_ADMIN`, `ADMIN`, `HOD`, `PROFESSOR`, `STUDENT`, `ACCOUNTANT`, `LIBRARIAN`
- **Granular Permissions**: 36 module-level permissions assigned across roles
- **Grade Definitions**: Standard 10-point scale (`O`, `A+`, `A`, `B+`, `B`, `C`, `P`, `F`)

---

## ❓ Troubleshooting & FAQs

### Port Already in Use (e.g. 3306 or 8080)
- **Problem**: You have a local MySQL or Tomcat service already running.
- **Fix**: Either stop your local service (e.g., `net stop MySQL80` on Windows) or change the host port mapping in `docker-compose.yml` (e.g., `"3307:3306"`).

### Redis Connection Warning on Startup
- **Problem**: The backend warns `Unable to connect to Redis`.
- **Fix**: The backend incorporates a fault-tolerant `CacheErrorHandler`. If Redis is not running locally, caching is gracefully bypassed and queries fall back directly to MySQL. To enable caching, start Redis via `docker compose up redis -d`.

### Flyway Migration Checksum Mismatch
- **Problem**: You modified an already executed SQL migration script in `db/migration/`.
- **Fix**: For local development resets, run:
  ```bash
  docker compose down -v
  docker compose up mysql redis -d
  ```
