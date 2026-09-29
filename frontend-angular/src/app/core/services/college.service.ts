import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CollegeRequest, CollegeResponse, CollegeSummaryResponse, PageResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CollegeService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/colleges';

  create(data: CollegeRequest): Observable<CollegeResponse> { return this.http.post<CollegeResponse>(this.apiUrl, data); }
  getById(id: number): Observable<CollegeResponse> { return this.http.get<CollegeResponse>(`${this.apiUrl}/${id}`); }
  getByCode(code: string): Observable<CollegeResponse> { return this.http.get<CollegeResponse>(`${this.apiUrl}/code/${code}`); }
  getAll(page: number = 0, size: number = 10, sortBy: string = 'id', sortDir: string = 'asc'): Observable<PageResponse<CollegeSummaryResponse>> {
    let params = new HttpParams().set('page', page).set('size', size).set('sortBy', sortBy).set('sortDir', sortDir);
    return this.http.get<PageResponse<CollegeSummaryResponse>>(this.apiUrl, { params });
  }
  search(query: string, page: number = 0, size: number = 10): Observable<PageResponse<CollegeSummaryResponse>> {
    let params = new HttpParams().set('query', query).set('page', page).set('size', size);
    return this.http.get<PageResponse<CollegeSummaryResponse>>(`${this.apiUrl}/search`, { params });
  }
  update(id: number, data: CollegeRequest): Observable<CollegeResponse> { return this.http.put<CollegeResponse>(`${this.apiUrl}/${id}`, data); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }
  toggleStatus(id: number): Observable<void> { return this.http.put<void>(`${this.apiUrl}/${id}/toggle-status`, {}); }
}
