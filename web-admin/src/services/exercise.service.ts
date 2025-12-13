import axiosClient from '../utils/axiosClient';
import type { Exercise, NhomCo } from '../types/exercise.type';

export const exerciseService = {
  // Lấy danh sách bài tập
  getExercises: async (): Promise<Exercise[]> => {
    const res: any = await axiosClient.get('/exercises');
    return res.data.data || res.data || [];
  },

  // Lấy danh sách nhóm cơ
  getNhomCos: async (): Promise<NhomCo[]> => {
    const res: any = await axiosClient.get('/exercises/nhom-co');
    return res.data.data || res.data || [];
  },

  // Tạo bài tập mới (Nhận FormData để hỗ trợ upload file)
  createExercise: async (data: FormData) => {
    // Header 'Content-Type': 'multipart/form-data' thường được axios tự động set khi data là FormData
    return axiosClient.post('/exercises', data);
  },

  // Cập nhật bài tập
  updateExercise: async (id: number, formData: FormData) => {
    return axiosClient.put(`/exercises/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // Xóa bài tập
  deleteExercise: async (id: number) => {
    return axiosClient.delete(`/exercises/${id}`);
  }
};