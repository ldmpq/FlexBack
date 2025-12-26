import axiosClient, { setAuthToken } from '../utils/axiosClient';
import type { LoginCredentials, LoginResponse, RegisterPayload } from '../types/auth.type';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const res = await axiosClient.post('/auth/login', credentials);
    return res.data;
  },

  logout: async () => {
    try {
      // Clear token khỏi axios header
      setAuthToken('');

      return true;
    } catch (error) {
      console.error('AuthService logout error:', error);
      throw error;
    }
  },

  changePassword: (currentPassword: string, newPassword: string) => {
    return axiosClient.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },
};