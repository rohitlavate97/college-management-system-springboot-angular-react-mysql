import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_ROLE_KEY = 'user_role';

  currentUser = signal<any>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.loadUser();
  }

  login(credentials: any) {
    return this.http.post<any>('/api/v1/auth/login', credentials).pipe(
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        localStorage.setItem(this.USER_ROLE_KEY, res.role);
        this.currentUser.set({ role: res.role, username: credentials.username });
        this.router.navigate(['/dashboard']);
      })
    );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_ROLE_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private loadUser() {
    if (this.isAuthenticated()) {
      const role = localStorage.getItem(this.USER_ROLE_KEY) || 'USER';
      this.currentUser.set({ role, username: 'User' });
    }
  }
}
