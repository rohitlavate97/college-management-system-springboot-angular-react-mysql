import axiosClient from './axiosClient';
import { CourseRequest, CourseResponse, CourseSummaryResponse, PageResponse } from '@/types';

export const courseService = {
  create: (data: CourseRequest) => axiosClient.post<CourseResponse>('/courses', data),
  getById: (id: number) => axiosClient.get<CourseResponse>(`/courses/${id}`),
  getAll: (params?: { departmentId?: number; isActive?: boolean; query?: string; page?: number; size?: number }) => axiosClient.get<PageResponse<CourseSummaryResponse>>('/courses', { params }),
  update: (id: number, data: CourseRequest) => axiosClient.put<CourseResponse>(`/courses/${id}`, data),
  delete: (id: number) => axiosClient.delete(`/courses/${id}`),
};
