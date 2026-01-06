import { ReportHistory } from '../types/result.type';
import axiosClient from '../utils/axiosClient';

export const reportService = {
  createReport: async (data: { 
    maKeHoach: number | string; 
    thoiLuong: number | string; // Phút
    mucDoDau: number | string;  // 1-10
    danhGiaSoBo: string;
    ngayLuyenTap?: string;
  }) => {
    return axiosClient.post('/baocao', data); 
  },

  getMyReports: async (): Promise<ReportHistory[]> => {
    const res = await axiosClient.get('/baocao/history');
    return res.data.data || [];
  }
};