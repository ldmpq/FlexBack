import axiosClient from '../utils/axiosClient';
import type { AccountFormData, StaffAccount } from '../types/account.type';

export const accountService = {
  // Lấy danh sách nhân viên
  getAllStaff: async (): Promise<StaffAccount[]> => {
    const res: any = await axiosClient.get('/accounts/staff');
    return res.data.data || res.data || [];
  },

  // Lấy chi tiết tài khoản (bao gồm thông tin chuyên môn)
  getAccountDetail: async (id: number): Promise<StaffAccount> => {
    const res: any = await axiosClient.get(`/accounts/detail/${id}`);
    return res.data.data || res.data;
  },

  // Tạo tài khoản mới
  createAccount: async (data: Omit<AccountFormData, 'xacNhanMatKhau'>) => {
    return axiosClient.post('/accounts', data);
  },

  // Cập nhật tài khoản
  updateAccount: async (id: number, data: Omit<AccountFormData, 'xacNhanMatKhau'>) => {
    return axiosClient.put(`/accounts/update/${id}`, data);
  },

  // Xóa tài khoản
  deleteAccount: async (id: number) => {
    return axiosClient.delete(`/accounts/delete/${id}`);
  }
};