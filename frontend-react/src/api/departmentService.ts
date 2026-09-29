import axiosClient from './axiosClient';
import { DepartmentRequest, DepartmentResponse, DepartmentSummaryResponse, PageResponse } from '@/types';

export const departmentService = {
  create: (data: DepartmentRequest) => axiosClient.post<DepartmentResponse>('/departments', data),
  getById: (id: number) => axiosClient.get<DepartmentResponse>(`/departments/${id}`),
  getByCode: (code: string) => axiosClient.get<DepartmentResponse>(`/departments/code/${code}`),
  getAll: (params?: { page?: number; size?: number; sortBy?: string; sortDir?: string }) => axiosClient.get<PageResponse<DepartmentSummaryResponse>>('/departments', { params }),
  getByCollege: (collegeId: number, params?: { page?: number; size?: number }) => axiosClient.get<PageResponse<DepartmentSummaryResponse>>(`/departments/college/${collegeId}`, { params }),
  getActiveByCollege: (collegeId: number) => axiosClient.get<DepartmentSummaryResponse[]>(`/departments/college/${collegeId}/active`),
  search: (params: { query: string; page?: number; size?: number }) => axiosClient.get<PageResponse<DepartmentSummaryResponse>>('/departments/search', { params }),
  update: (id: number, data: DepartmentRequest) => axiosClient.put<DepartmentResponse>(`/departments/${id}`, data),
  delete: (id: number) => axiosClient.delete(`/departments/${id}`),
  toggleStatus: (id: number) => axiosClient.patch(`/departments/${id}/status`),
};
