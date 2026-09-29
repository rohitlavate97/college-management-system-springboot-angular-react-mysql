import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DepartmentRequest, DepartmentResponse, DepartmentSummaryResponse, PageResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/departments';

  create(data: DepartmentRequest): Observable<DepartmentResponse> { return this.http.post<DepartmentResponse>(this.apiUrl, data); }
  getById(id: number): Observable<DepartmentResponse> { return this.http.get<DepartmentResponse>(`${this.apiUrl}/${id}`); }
  getAll(page: number = 0, size: number = 10, sortBy: string = 'id', sortDir: string = 'asc'): Observable<PageResponse<DepartmentSummaryResponse>> {
    let params = new HttpParams().set('page', page).set('size', size).set('sortBy', sortBy).set('sortDir', sortDir);
    return this.http.get<PageResponse<DepartmentSummaryResponse>>(this.apiUrl, { params });
  }
  search(query: string, page: number = 0, size: number = 10): Observable<PageResponse<DepartmentSummaryResponse>> {
    let params = new HttpParams().set('query', query).set('page', page).set('size', size);
    return this.http.get<PageResponse<DepartmentSummaryResponse>>(`${this.apiUrl}/search`, { params });
  }
  update(id: number, data: DepartmentRequest): Observable<DepartmentResponse> { return this.http.put<DepartmentResponse>(`${this.apiUrl}/${id}`, data); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }
  toggleStatus(id: number): Observable<void> { return this.http.put<void>(`${this.apiUrl}/${id}/toggle-status`, {}); }
}
