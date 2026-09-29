import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BatchAttendanceRequest, AttendanceResponse, AttendanceStatsResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/attendance';

  markBatch(data: BatchAttendanceRequest): Observable<AttendanceResponse[]> { return this.http.post<AttendanceResponse[]>(this.apiUrl, data); }
  getByStudent(studentId: number): Observable<AttendanceResponse[]> { return this.http.get<AttendanceResponse[]>(`${this.apiUrl}/student/${studentId}`); }
  getBySubject(subjectId: number, date?: string): Observable<AttendanceResponse[]> { 
    let params = new HttpParams();
    if(date) params = params.set('date', date);
    return this.http.get<AttendanceResponse[]>(`${this.apiUrl}/subject/${subjectId}`, { params }); 
  }
  getStudentStats(studentId: number, subjectId?: number): Observable<AttendanceStatsResponse | AttendanceStatsResponse[]> { 
    let params = new HttpParams();
    if(subjectId) params = params.set('subjectId', subjectId);
    return this.http.get<any>(`${this.apiUrl}/stats/student/${studentId}`, { params }); 
  }
}
