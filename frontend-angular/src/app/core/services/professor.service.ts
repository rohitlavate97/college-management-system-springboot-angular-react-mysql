import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfessorRequest, ProfessorResponse, ProfessorSummaryResponse, PageResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ProfessorService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/professors';

  create(data: ProfessorRequest): Observable<ProfessorResponse> { return this.http.post<ProfessorResponse>(this.apiUrl, data); }
  getById(id: number): Observable<ProfessorResponse> { return this.http.get<ProfessorResponse>(`${this.apiUrl}/${id}`); }
  getAll(page: number = 0, size: number = 10, sortBy: string = 'id', sortDir: string = 'asc'): Observable<PageResponse<ProfessorSummaryResponse>> {
    let params = new HttpParams().set('page', page).set('size', size).set('sortBy', sortBy).set('sortDir', sortDir);
    return this.http.get<PageResponse<ProfessorSummaryResponse>>(this.apiUrl, { params });
  }
  search(query: string, page: number = 0, size: number = 10): Observable<PageResponse<ProfessorSummaryResponse>> {
    let params = new HttpParams().set('query', query).set('page', page).set('size', size);
    return this.http.get<PageResponse<ProfessorSummaryResponse>>(`${this.apiUrl}/search`, { params });
  }
  update(id: number, data: ProfessorRequest): Observable<ProfessorResponse> { return this.http.put<ProfessorResponse>(`${this.apiUrl}/${id}`, data); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }
  toggleStatus(id: number): Observable<void> { return this.http.put<void>(`${this.apiUrl}/${id}/toggle-status`, {}); }
}
