import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubjectRequest, SubjectResponse, SubjectSummaryResponse, PageResponse, SubjectAssignmentRequest, SubjectAssignmentResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class SubjectService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/subjects';

  create(data: SubjectRequest): Observable<SubjectResponse> { return this.http.post<SubjectResponse>(this.apiUrl, data); }
  getById(id: number): Observable<SubjectResponse> { return this.http.get<SubjectResponse>(`${this.apiUrl}/${id}`); }
  getAll(page: number = 0, size: number = 10, sortBy: string = 'id', sortDir: string = 'asc'): Observable<PageResponse<SubjectSummaryResponse>> {
    let params = new HttpParams().set('page', page).set('size', size).set('sortBy', sortBy).set('sortDir', sortDir);
    return this.http.get<PageResponse<SubjectSummaryResponse>>(this.apiUrl, { params });
  }
  search(query: string, page: number = 0, size: number = 10): Observable<PageResponse<SubjectSummaryResponse>> {
    let params = new HttpParams().set('query', query).set('page', page).set('size', size);
    return this.http.get<PageResponse<SubjectSummaryResponse>>(`${this.apiUrl}/search`, { params });
  }
  update(id: number, data: SubjectRequest): Observable<SubjectResponse> { return this.http.put<SubjectResponse>(`${this.apiUrl}/${id}`, data); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }
  toggleStatus(id: number): Observable<void> { return this.http.put<void>(`${this.apiUrl}/${id}/toggle-status`, {}); }

  assignProfessor(data: SubjectAssignmentRequest): Observable<SubjectAssignmentResponse> { return this.http.post<SubjectAssignmentResponse>(`${this.apiUrl}/assignments`, data); }
  getAssignments(subjectId: number): Observable<SubjectAssignmentResponse[]> { return this.http.get<SubjectAssignmentResponse[]>(`${this.apiUrl}/${subjectId}/assignments`); }
}
