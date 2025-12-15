import axiosClient, { setAuthToken } from '../utils/axiosClient';
import type { LoginCredentials, LoginResponse } from '../types/auth.type';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const res = await axiosClient.post('/auth/login', credentials);
    return res.data;
  },

  logout: async () => {
    try {
      // Clear token khỏi axios header
      setAuthToken('');

      // Clear token khỏi local storage (nếu dùng)
      // await AsyncStorage.removeItem('token');

      return true;
    } catch (error) {
      console.error('AuthService logout error:', error);
      throw error;
    }
  },

  // Có thể thêm register, forgotPassword ở đây sau này
};