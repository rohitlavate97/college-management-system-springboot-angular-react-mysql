import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResultEntryRequest, ResultResponse, StudentReportCardResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ResultService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/results';

  entry(data: ResultEntryRequest): Observable<ResultResponse[]> { return this.http.post<ResultResponse[]>(this.apiUrl, data); }
  getByExamSubject(examSubjectId: number): Observable<ResultResponse[]> { return this.http.get<ResultResponse[]>(`${this.apiUrl}/exam-subject/${examSubjectId}`); }
  publish(examSubjectId: number): Observable<void> { return this.http.post<void>(`${this.apiUrl}/publish/${examSubjectId}`, {}); }
  getReportCard(studentId: number, examId: number): Observable<StudentReportCardResponse> {
    return this.http.get<StudentReportCardResponse>(`${this.apiUrl}/report-card/student/${studentId}/exam/${examId}`);
  }
}
