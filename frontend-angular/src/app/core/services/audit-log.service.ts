import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuditLogResponse, PageResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuditLogService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/audit';

  getAll(page: number = 0, size: number = 10): Observable<PageResponse<AuditLogResponse>> {
    let params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<AuditLogResponse>>(this.apiUrl, { params });
  }
}
