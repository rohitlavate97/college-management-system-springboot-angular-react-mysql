import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { LoginRequest, AuthResponse, UserProfile } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = '/api/v1/auth';

  currentUser = signal<UserProfile | null>(null);
  currentRoles = signal<string[]>([]);

  constructor() {
    this.checkStoredToken();
  }

  private checkStoredToken(): void {
    const token = this.getToken();
    if (token) {
      this.http.get<UserProfile>(`${this.apiUrl}/me`).pipe(
        catchError(() => {
          this.logout();
          return of(null);
        })
      ).subscribe(user => {
        if (user) {
          this.currentUser.set(user);
          this.currentRoles.set(user.roles || []);
        }
      });
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.storeTokens(response);
        this.currentRoles.set(response.roles || []);
        this.http.get<UserProfile>(`${this.apiUrl}/me`).subscribe(user => {
            this.currentUser.set(user);
        });
      })
    );
  }

  logout(): void {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      this.http.post(`${this.apiUrl}/logout`, { refreshToken }).pipe(
        catchError(() => of(null))
      ).subscribe(() => {
        this.clearStorage();
        this.router.navigate(['/login']);
      });
    } else {
      this.clearStorage();
      this.router.navigate(['/login']);
    }
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return of({} as AuthResponse);
    }
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, { refreshToken }).pipe(
      tap(response => this.storeTokens(response))
    );
  }

  private storeTokens(response: AuthResponse): void {
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
  }

  private clearStorage(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.currentUser.set(null);
    this.currentRoles.set([]);
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasRole(role: string): boolean {
    return this.currentRoles().includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }
}
