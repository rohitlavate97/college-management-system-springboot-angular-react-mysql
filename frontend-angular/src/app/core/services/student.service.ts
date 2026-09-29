import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudentRequest, StudentResponse, StudentSummaryResponse, PageResponse, EnrollmentRequest, EnrollmentResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/students';

  create(data: StudentRequest): Observable<StudentResponse> { return this.http.post<StudentResponse>(this.apiUrl, data); }
  getById(id: number): Observable<StudentResponse> { return this.http.get<StudentResponse>(`${this.apiUrl}/${id}`); }
  getAll(page: number = 0, size: number = 10, sortBy: string = 'id', sortDir: string = 'asc'): Observable<PageResponse<StudentSummaryResponse>> {
    let params = new HttpParams().set('page', page).set('size', size).set('sortBy', sortBy).set('sortDir', sortDir);
    return this.http.get<PageResponse<StudentSummaryResponse>>(this.apiUrl, { params });
  }
  search(query: string, page: number = 0, size: number = 10): Observable<PageResponse<StudentSummaryResponse>> {
    let params = new HttpParams().set('query', query).set('page', page).set('size', size);
    return this.http.get<PageResponse<StudentSummaryResponse>>(`${this.apiUrl}/search`, { params });
  }
  update(id: number, data: StudentRequest): Observable<StudentResponse> { return this.http.put<StudentResponse>(`${this.apiUrl}/${id}`, data); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }
  toggleStatus(id: number): Observable<void> { return this.http.put<void>(`${this.apiUrl}/${id}/toggle-status`, {}); }

  enrollInSubject(studentId: number, request: EnrollmentRequest): Observable<EnrollmentResponse> {
    return this.http.post<EnrollmentResponse>(`${this.apiUrl}/${studentId}/enrollments`, request);
  }
  getEnrollments(studentId: number): Observable<EnrollmentResponse[]> {
    return this.http.get<EnrollmentResponse[]>(`${this.apiUrl}/${studentId}/enrollments`);
  }
}
