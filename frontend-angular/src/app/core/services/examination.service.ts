import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExaminationRequest, ExaminationResponse, ExamSubjectRequest, ExamSubjectResponse, PageResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ExaminationService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/examinations';

  create(data: ExaminationRequest): Observable<ExaminationResponse> { return this.http.post<ExaminationResponse>(this.apiUrl, data); }
  getById(id: number): Observable<ExaminationResponse> { return this.http.get<ExaminationResponse>(`${this.apiUrl}/${id}`); }
  getAll(page: number = 0, size: number = 10, sortBy: string = 'id', sortDir: string = 'asc'): Observable<PageResponse<ExaminationResponse>> {
    let params = new HttpParams().set('page', page).set('size', size).set('sortBy', sortBy).set('sortDir', sortDir);
    return this.http.get<PageResponse<ExaminationResponse>>(this.apiUrl, { params });
  }
  update(id: number, data: ExaminationRequest): Observable<ExaminationResponse> { return this.http.put<ExaminationResponse>(`${this.apiUrl}/${id}`, data); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }
  
  scheduleSubject(examId: number, data: ExamSubjectRequest): Observable<ExamSubjectResponse> {
    return this.http.post<ExamSubjectResponse>(`${this.apiUrl}/${examId}/subjects`, data);
  }
}
