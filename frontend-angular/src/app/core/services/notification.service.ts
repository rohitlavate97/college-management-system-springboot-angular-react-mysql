import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SendNotificationRequest, NotificationResponse, NotificationPreferenceRequest, NotificationPreferenceResponse, PageResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/notifications';

  getList(page: number = 0, size: number = 10, unreadOnly: boolean = false): Observable<PageResponse<NotificationResponse>> {
    let params = new HttpParams().set('page', page).set('size', size).set('unreadOnly', unreadOnly);
    return this.http.get<PageResponse<NotificationResponse>>(this.apiUrl, { params });
  }
  getUnreadCount(): Observable<{count: number}> { return this.http.get<{count: number}>(`${this.apiUrl}/unread-count`); }
  markRead(id: number): Observable<void> { return this.http.put<void>(`${this.apiUrl}/${id}/read`, {}); }
  markAllRead(): Observable<void> { return this.http.put<void>(`${this.apiUrl}/read-all`, {}); }
  send(data: SendNotificationRequest): Observable<void> { return this.http.post<void>(`${this.apiUrl}/send`, data); }
  
  getPreferences(): Observable<NotificationPreferenceResponse[]> { return this.http.get<NotificationPreferenceResponse[]>(`${this.apiUrl}/preferences`); }
  updatePreferences(data: NotificationPreferenceRequest[]): Observable<NotificationPreferenceResponse[]> { return this.http.put<NotificationPreferenceResponse[]>(`${this.apiUrl}/preferences`, data); }
}
