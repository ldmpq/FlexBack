import axiosClient from '../utils/axiosClient';

export const profileService = {
  getUserInfo: () => axiosClient.get('/auth/me'),

  getMedicalProfile: () => axiosClient.get('/users/profile'),

  updateProfile: (payload: any) =>
    axiosClient.put('/users/profile', payload),
};
