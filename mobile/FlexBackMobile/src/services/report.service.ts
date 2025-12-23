import axiosClient from '../utils/axiosClient';

export const reportService = {
  // Tạo báo cáo mới
  createReport: async (data: { 
    maKeHoach: number | string; 
    thoiLuong: number | string; // Phút
    mucDoDau: number | string;  // 1-10
    danhGiaSoBo: string;
    ngayLuyenTap?: string;
  }) => {
    return axiosClient.post('/baocao', data); 
  }
};