import axiosClient from '../utils/axiosClient';
import type { CreateNhomCoDTO, NhomCo } from '../types/muscle.type';

// Lưu ý: Đảm bảo Base URL trong axiosClient đã trỏ về đúng server (ví dụ: http://localhost:3000/api)

export const nhomCoService = {
  async getAll(): Promise<NhomCo[]> {
    const res = await axiosClient.get('/nhom-co');

    if (res.data && Array.isArray(res.data)) return res.data; 
    if (res.data && res.data.data && Array.isArray(res.data.data)) return res.data.data;

    return (res as any).data || [];
  },

  async create(data: CreateNhomCoDTO) {
    return axiosClient.post('/nhom-co', data);
  },

  async update(id: number, data: Partial<CreateNhomCoDTO>) {
    return axiosClient.put(`/nhom-co/${id}`, data);
  },

  async delete(id: number) {
    return axiosClient.delete(`/nhom-co/${id}`);
  }
};