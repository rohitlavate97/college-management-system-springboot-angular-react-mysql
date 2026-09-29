import axiosClient from './axiosClient';
import { BatchAttendanceRequest, AttendanceResponse, AttendanceStatsResponse, PageResponse } from '@/types';

export const attendanceService = {
  markBatch: (data: BatchAttendanceRequest) => axiosClient.post<AttendanceResponse[]>('/attendance/batch', data),
  getByStudent: (studentId: number, params?: { page?: number; size?: number }) => axiosClient.get<PageResponse<AttendanceResponse>>(`/attendance/student/${studentId}`, { params }),
  getBySubject: (subjectId: number, attendanceDate?: string) => axiosClient.get<AttendanceResponse[]>(`/attendance/subject/${subjectId}`, { params: { date: attendanceDate } }),
  getStudentStats: (studentId: number, subjectId?: number) => axiosClient.get<AttendanceStatsResponse[]>(`/attendance/student/${studentId}/stats`, { params: { subjectId } }),
};
