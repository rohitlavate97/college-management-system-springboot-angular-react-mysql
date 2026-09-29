import axiosClient from './axiosClient';
import { ProfessorRequest, ProfessorResponse, ProfessorSummaryResponse, PageResponse } from '@/types';

export const professorService = {
  create: (data: ProfessorRequest) => axiosClient.post<ProfessorResponse>('/professors', data),
  getById: (id: number) => axiosClient.get<ProfessorResponse>(`/professors/${id}`),
  getByEmployeeId: (employeeId: string) => axiosClient.get<ProfessorResponse>(`/professors/employee/${employeeId}`),
  getAll: (params?: { page?: number; size?: number; sortBy?: string; sortDir?: string }) => axiosClient.get<PageResponse<ProfessorSummaryResponse>>('/professors', { params }),
  getByDepartment: (departmentId: number, params?: { page?: number; size?: number }) => axiosClient.get<PageResponse<ProfessorSummaryResponse>>(`/professors/department/${departmentId}`, { params }),
  search: (params: { query: string; page?: number; size?: number }) => axiosClient.get<PageResponse<ProfessorSummaryResponse>>('/professors/search', { params }),
  update: (id: number, data: ProfessorRequest) => axiosClient.put<ProfessorResponse>(`/professors/${id}`, data),
  updateStatus: (id: number, status: string) => axiosClient.patch(`/professors/${id}/status`, { status }),
  delete: (id: number) => axiosClient.delete(`/professors/${id}`),
};
