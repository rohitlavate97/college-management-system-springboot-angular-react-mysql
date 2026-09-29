import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CourseRequest, CourseResponse, CourseSummaryResponse, PageResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/courses';

  create(data: CourseRequest): Observable<CourseResponse> { return this.http.post<CourseResponse>(this.apiUrl, data); }
  getById(id: number): Observable<CourseResponse> { return this.http.get<CourseResponse>(`${this.apiUrl}/${id}`); }
  getAll(page: number = 0, size: number = 10, sortBy: string = 'id', sortDir: string = 'asc'): Observable<PageResponse<CourseSummaryResponse>> {
    let params = new HttpParams().set('page', page).set('size', size).set('sortBy', sortBy).set('sortDir', sortDir);
    return this.http.get<PageResponse<CourseSummaryResponse>>(this.apiUrl, { params });
  }
  search(query: string, page: number = 0, size: number = 10): Observable<PageResponse<CourseSummaryResponse>> {
    let params = new HttpParams().set('query', query).set('page', page).set('size', size);
    return this.http.get<PageResponse<CourseSummaryResponse>>(`${this.apiUrl}/search`, { params });
  }
  update(id: number, data: CourseRequest): Observable<CourseResponse> { return this.http.put<CourseResponse>(`${this.apiUrl}/${id}`, data); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }
  toggleStatus(id: number): Observable<void> { return this.http.put<void>(`${this.apiUrl}/${id}/toggle-status`, {}); }
}
