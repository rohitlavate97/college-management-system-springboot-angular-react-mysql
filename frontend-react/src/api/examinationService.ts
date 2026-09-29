import axiosClient from './axiosClient';
import { ExaminationRequest, ExaminationResponse, ExamSubjectRequest, ExamSubjectResponse, PageResponse } from '@/types';

export const examinationService = {
  create: (data: ExaminationRequest) => axiosClient.post<ExaminationResponse>('/examinations', data),
  update: (id: number, data: ExaminationRequest) => axiosClient.put<ExaminationResponse>(`/examinations/${id}`, data),
  updateStatus: (id: number, status: string) => axiosClient.patch(`/examinations/${id}/status`, { status }),
  getById: (id: number) => axiosClient.get<ExaminationResponse>(`/examinations/${id}`),
  getAll: (params?: { page?: number; size?: number; academicYear?: string }) => axiosClient.get<PageResponse<ExaminationResponse>>('/examinations', { params }),
  addSubject: (examId: number, data: ExamSubjectRequest) => axiosClient.post<ExamSubjectResponse>(`/examinations/${examId}/subjects`, data),
  getSubjects: (examId: number) => axiosClient.get<ExamSubjectResponse[]>(`/examinations/${examId}/subjects`),
  deleteSubject: (examId: number, subjectId: number) => axiosClient.delete(`/examinations/${examId}/subjects/${subjectId}`),
};
