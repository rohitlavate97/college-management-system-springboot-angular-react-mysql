import axiosClient from './axiosClient';
import { StudentRequest, StudentResponse, StudentSummaryResponse, EnrollmentRequest, EnrollmentResponse, PageResponse } from '@/types';

export const studentService = {
  create: (data: StudentRequest) => axiosClient.post<StudentResponse>('/students', data),
  getById: (id: number) => axiosClient.get<StudentResponse>(`/students/${id}`),
  getByRollNumber: (rollNumber: string) => axiosClient.get<StudentResponse>(`/students/roll/${rollNumber}`),
  getAll: (params?: { page?: number; size?: number; sortBy?: string; sortDir?: string }) => axiosClient.get<PageResponse<StudentSummaryResponse>>('/students', { params }),
  getByDepartment: (departmentId: number, params?: { page?: number; size?: number }) => axiosClient.get<PageResponse<StudentSummaryResponse>>(`/students/department/${departmentId}`, { params }),
  getByCourse: (courseId: number, params?: { page?: number; size?: number }) => axiosClient.get<PageResponse<StudentSummaryResponse>>(`/students/course/${courseId}`, { params }),
  search: (params: { query: string; page?: number; size?: number }) => axiosClient.get<PageResponse<StudentSummaryResponse>>('/students/search', { params }),
  update: (id: number, data: StudentRequest) => axiosClient.put<StudentResponse>(`/students/${id}`, data),
  updateStatus: (id: number, status: string) => axiosClient.patch(`/students/${id}/status`, { status }),
  delete: (id: number) => axiosClient.delete(`/students/${id}`),
  enrollStudent: (studentId: number, data: EnrollmentRequest) => axiosClient.post<EnrollmentResponse>(`/students/${studentId}/enrollments`, data),
  getEnrollments: (studentId: number) => axiosClient.get<EnrollmentResponse[]>(`/students/${studentId}/enrollments`),
};
