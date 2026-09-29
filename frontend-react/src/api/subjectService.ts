import axiosClient from './axiosClient';
import { SubjectRequest, SubjectResponse, SubjectSummaryResponse, SubjectAssignmentRequest, SubjectAssignmentResponse, PageResponse } from '@/types';

export const subjectService = {
  create: (data: SubjectRequest) => axiosClient.post<SubjectResponse>('/subjects', data),
  getById: (id: number) => axiosClient.get<SubjectResponse>(`/subjects/${id}`),
  getAll: (params?: { departmentId?: number; courseId?: number; semester?: number; query?: string; page?: number; size?: number }) => axiosClient.get<PageResponse<SubjectSummaryResponse>>('/subjects', { params }),
  update: (id: number, data: SubjectRequest) => axiosClient.put<SubjectResponse>(`/subjects/${id}`, data),
  delete: (id: number) => axiosClient.delete(`/subjects/${id}`),
  createAssignment: (data: SubjectAssignmentRequest) => axiosClient.post<SubjectAssignmentResponse>('/subjects/assignments', data),
  getAssignments: (params?: { professorId?: number; subjectId?: number; academicYear?: string }) => axiosClient.get<SubjectAssignmentResponse[]>('/subjects/assignments', { params }),
  deleteAssignment: (id: number) => axiosClient.delete(`/subjects/assignments/${id}`),
};
