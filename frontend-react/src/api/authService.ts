import axiosClient from './axiosClient';
import { LoginRequest, AuthResponse, UserProfile, RefreshTokenRequest } from '@/types';

export const authService = {
  login: (data: LoginRequest) => axiosClient.post<AuthResponse>('/auth/login', data),
  refreshToken: (data: RefreshTokenRequest) => axiosClient.post<AuthResponse>('/auth/refresh-token', data),
  logout: (refreshToken: string) => axiosClient.post('/auth/logout', { refreshToken }),
  getMe: () => axiosClient.get<UserProfile>('/auth/me'),
};
