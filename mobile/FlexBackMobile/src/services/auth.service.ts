import axiosClient from '../utils/axiosClient';
import type { LoginCredentials, LoginResponse } from '../types/auth.type';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const res = await axiosClient.post('/auth/login', credentials);
    return res.data;
  },

  // Có thể thêm register, logout, forgotPassword ở đây sau này
};