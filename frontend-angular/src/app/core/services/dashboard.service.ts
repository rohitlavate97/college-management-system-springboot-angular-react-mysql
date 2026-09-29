import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminDashboardResponse, ProfessorDashboardResponse, StudentDashboardResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/dashboard';

  getAdminStats(): Observable<AdminDashboardResponse> { return this.http.get<AdminDashboardResponse>(`${this.apiUrl}/admin`); }
  getProfessorStats(): Observable<ProfessorDashboardResponse> { return this.http.get<ProfessorDashboardResponse>(`${this.apiUrl}/professor`); }
  getStudentStats(): Observable<StudentDashboardResponse> { return this.http.get<StudentDashboardResponse>(`${this.apiUrl}/student`); }
}
