import axiosClient from './axiosClient';
import { CollegeRequest, CollegeResponse, CollegeSummaryResponse, PageResponse } from '@/types';

export const collegeService = {
  create: (data: CollegeRequest) => axiosClient.post<CollegeResponse>('/colleges', data),
  getById: (id: number) => axiosClient.get<CollegeResponse>(`/colleges/${id}`),
  getByCode: (code: string) => axiosClient.get<CollegeResponse>(`/colleges/code/${code}`),
  getAll: (params?: { page?: number; size?: number; sortBy?: string; sortDir?: string }) => axiosClient.get<PageResponse<CollegeSummaryResponse>>('/colleges', { params }),
  search: (params: { query: string; page?: number; size?: number }) => axiosClient.get<PageResponse<CollegeSummaryResponse>>('/colleges/search', { params }),
  update: (id: number, data: CollegeRequest) => axiosClient.put<CollegeResponse>(`/colleges/${id}`, data),
  delete: (id: number) => axiosClient.delete(`/colleges/${id}`),
  toggleStatus: (id: number) => axiosClient.patch(`/colleges/${id}/status`),
};
