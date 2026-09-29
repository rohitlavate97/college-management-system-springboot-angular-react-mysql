import axiosClient from './axiosClient';
import { ResultEntryRequest, ResultResponse, StudentReportCardResponse } from '@/types';

export const resultService = {
  entryResults: (data: ResultEntryRequest) => axiosClient.post<ResultResponse[]>('/results/entry', data),
  getByExamSubject: (examSubjectId: number) => axiosClient.get<ResultResponse[]>(`/results/exam-subject/${examSubjectId}`),
  publishResults: (examSubjectId: number) => axiosClient.post(`/results/exam-subject/${examSubjectId}/publish`),
  getStudentReportCard: (studentId: number, examId: number) => axiosClient.get<StudentReportCardResponse>(`/results/student/${studentId}/exam/${examId}`),
  getStudentAllReportCards: (studentId: number) => axiosClient.get<StudentReportCardResponse[]>(`/results/student/${studentId}/all`),
};
