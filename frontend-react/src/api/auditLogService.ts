import axiosClient from './axiosClient';
import { AuditLogResponse, PageResponse } from '@/types';

export const auditLogService = {
  getAll: (params?: { page?: number; size?: number; sortBy?: string; sortDir?: string }) => axiosClient.get<PageResponse<AuditLogResponse>>('/audit-logs', { params }),
  getByUser: (userId: number, params?: { page?: number; size?: number }) => axiosClient.get<PageResponse<AuditLogResponse>>(`/audit-logs/user/${userId}`, { params }),
  getByAction: (action: string, params?: { page?: number; size?: number }) => axiosClient.get<PageResponse<AuditLogResponse>>(`/audit-logs/action/${action}`, { params }),
};
