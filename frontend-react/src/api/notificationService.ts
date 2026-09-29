import axiosClient from './axiosClient';
import { SendNotificationRequest, NotificationResponse, NotificationPreferenceRequest, NotificationPreferenceResponse, PageResponse } from '@/types';

export const notificationService = {
  getAll: (params?: { page?: number; size?: number; unreadOnly?: boolean }) => axiosClient.get<PageResponse<NotificationResponse>>('/notifications', { params }),
  getUnreadCount: () => axiosClient.get<{count: number}>('/notifications/unread-count'),
  markAsRead: (id: number) => axiosClient.put(`/notifications/${id}/read`),
  markAllRead: () => axiosClient.put('/notifications/read-all'),
  send: (data: SendNotificationRequest) => axiosClient.post<NotificationResponse>('/notifications/send', data),
  getPreferences: () => axiosClient.get<NotificationPreferenceResponse[]>('/notifications/preferences'),
  updatePreferences: (data: NotificationPreferenceRequest[]) => axiosClient.put<NotificationPreferenceResponse[]>('/notifications/preferences', data),
};
