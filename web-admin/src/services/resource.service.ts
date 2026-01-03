import axiosClient from '../utils/axiosClient';
import type { Thuoc, ThucPham } from '../types/resource.type';

export const resourceService = {
  // --- THUỐC ---
  getAllThuoc: async () => {
    const res = await axiosClient.get('/thuoc');
    return res.data?.data || res.data || [];
  },
  createThuoc: async (data: Omit<Thuoc, 'maThuoc'>) => {
    return await axiosClient.post('/thuoc', data);
  },
  updateThuoc: async (id: number, data: Partial<Thuoc>) => {
    return await axiosClient.put(`/thuoc/${id}`, data);
  },
  deleteThuoc: async (id: number) => {
    return await axiosClient.delete(`/thuoc/${id}`);
  },

  // --- THỰC PHẨM ---
  getAllThucPham: async () => {
    const res = await axiosClient.get('/thucPham');
    return res.data?.data || res.data || [];
  },
  createThucPham: async (data: Omit<ThucPham, 'maThucPham'>) => {
    return await axiosClient.post('/thucPham', data);
  },
  updateThucPham: async (id: number, data: Partial<ThucPham>) => {
    return await axiosClient.put(`/thucPham/${id}`, data);
  },
  deleteThucPham: async (id: number) => {
    return await axiosClient.delete(`/thucPham/${id}`);
  }
};