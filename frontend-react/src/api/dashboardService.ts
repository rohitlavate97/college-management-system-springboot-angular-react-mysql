import axiosClient from './axiosClient';
import { AdminDashboardResponse, ProfessorDashboardResponse, StudentDashboardResponse } from '@/types';

export const dashboardService = {
  getAdminDashboard: () => axiosClient.get<AdminDashboardResponse>('/dashboard/admin'),
  getProfessorDashboard: () => axiosClient.get<ProfessorDashboardResponse>('/dashboard/professor'),
  getStudentDashboard: () => axiosClient.get<StudentDashboardResponse>('/dashboard/student'),
};
