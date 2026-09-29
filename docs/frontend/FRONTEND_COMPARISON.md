# Frontend Architectural Comparison: React vs. Angular

This document provides an in-depth comparative analysis between the **React** and **Angular** implementations in the College Management System. Both frontends are built to production standards, consuming the identical Spring Boot REST API (`/api/v1/*`) and WebSocket endpoints (`/ws`).

---

## 1. High-Level Architecture Overview

| Dimension | React Implementation | Angular Implementation |
|---|---|---|
| **Language & Tooling** | TypeScript 5.x, Vite 5.x | TypeScript 5.4.x, Angular CLI 18.x (esbuild/Vite) |
| **Paradigm** | Functional Components with Hooks | Standalone Components with Signals & Decorators |
| **State Management** | TanStack Query v5 (Server) + React Context (Client) | Angular Signals (Component) + RxJS Observables (Async) |
| **Routing** | React Router 6+ (Data API) | Angular Router (Functional Guards & Resolvers) |
| **Forms & Validation** | React Hook Form + Zod schema validation | Angular Reactive Forms (`FormGroup`, `FormControl`, `Validators`) |
| **HTTP Communication** | Axios with custom interceptors | Angular `HttpClient` with `HttpInterceptorFn` |
| **Styling** | Tailwind CSS + Lucide React icons | Tailwind CSS + CSS module utility classes |
| **Build Artifacts** | `dist/` (~224 kB initial chunk) | `dist/frontend-angular/` (~322 kB initial chunk) |

---

## 2. Authentication & Route Protection

### React Implementation
- **Mechanism**: `AuthContext.tsx` wraps the app and manages `accessToken`, `refreshToken`, and user identity in `localStorage`.
- **Route Guard**: `ProtectedRoute.tsx` checks if the user is authenticated and compares the user's role against an allowed roles array. Unauthenticated users are redirected to `/login`.
- **Token Refresh**: Axios response interceptor intercepts HTTP 401s, attempts a silent refresh at `/api/v1/auth/refresh-token`, queues pending requests, and retries the original request.

### Angular Implementation
- **Mechanism**: `auth.service.ts` uses Angular Signals (`currentUser = signal<User | null>(null)`) for high-performance reactive updates across UI bindings.
- **Route Guard**: Functional guard `auth.guard.ts` using `CanActivateFn` with dependency injection via `inject(AuthService)` and `inject(Router)`.
- **Token Refresh**: Functional `HttpInterceptorFn` (`jwt.interceptor.ts`) clones outgoing requests to append `Authorization: Bearer <token>` and catches `HttpErrorResponse` with status 401 to execute refresh rotation.

---

## 3. Data Fetching & Caching Strategy

### React: TanStack Query
```tsx
const { data: students, isLoading, error } = useQuery({
  queryKey: ['students', page, search],
  queryFn: () => studentApi.getAll({ page, query: search }),
  staleTime: 5 * 60 * 1000, // 5 min cache
});
```
- **Strengths**: Automated background refetching, query invalidation on mutation (`queryClient.invalidateQueries({ queryKey: ['students'] })`), declarative loading and error states out of the box.

### Angular: HttpClient with RxJS & Signals
```typescript
readonly students = signal<StudentSummaryResponse[]>([]);
readonly loading = signal<boolean>(false);

loadStudents(page: number, search: string) {
  this.loading.set(true);
  this.studentService.getAll(page, search).subscribe({
    next: (data) => {
      this.students.set(data.content);
      this.loading.set(false);
    },
    error: () => this.loading.set(false)
  });
}
```
- **Strengths**: Native integration with the Angular platform, zero third-party data library overhead, fine-grained DOM updates without zone pollution when using signals.

---

## 4. Form Handling & Schema Validation

### React: React Hook Form + Zod
- **Type Safety**: The Zod schema serves as the single source of truth for both TypeScript interfaces and runtime validation rules.
- **Performance**: Minimizes re-renders by using uncontrolled inputs and ref subscriptions.

### Angular: Reactive Forms
- **Structure**: Strongly-typed `FormGroup<{ email: FormControl<string> }>` providing deep status tracking (`valid`, `dirty`, `touched`, `pending`).
- **Templates**: Declarative validation binding in component templates with built-in accessibility helpers.

---

## 5. Performance & Bundle Metrics

| Metric | React (Vite) | Angular (CLI / esbuild) |
|---|---|---|
| **Build Time** | ~7.27 seconds | ~40.9 seconds |
| **Initial JS Size (raw)** | 224.88 kB | 275.72 kB |
| **Initial CSS Size (raw)** | 6.41 kB | 12.19 kB |
| **Transfer Size (gzipped)** | ~74.98 kB | ~85.56 kB |
| **Dev Server Start** | < 300 ms (native ESM) | ~2.5 s (Vite-backed Angular) |

---

## 6. Summary & Recommendations

- **React** excels in lightweight initial bundle size, rapid dev-server hot reloading, and composability with third-party tools like TanStack Query.
- **Angular** provides unmatched enterprise structure, consistent out-of-the-box opinionation, built-in dependency injection, and native signals for granular reactivity without additional state dependencies.
- **Both clients operate with 100% parity** against the unified Spring Boot backend REST endpoints, demonstrating clean API-contract decoupling.
