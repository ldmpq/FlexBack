import axiosClient from '../utils/axiosClient';
import type { DoctorOption, PatientDetailData } from '../types/patientDetail.type';

export const patientDetailService = {
  // Lấy chi tiết bệnh nhân theo ID tài khoản
  getPatientDetail: async (id: string): Promise<PatientDetailData> => {
    const res: any = await axiosClient.get(`/users/benh-nhan/${id}`);
    return res.data.data || res.data;
  },

  // Lấy danh sách bác sĩ để gán hồ sơ
  getDoctors: async (): Promise<DoctorOption[]> => {
    const res: any = await axiosClient.get('/hoso/bac-si'); 
    return res.data.data || res.data || [];
  },

  // Tạo hồ sơ bệnh án mới
  createHoSo: async (payload: { maBenhNhan: number; maBacSi: string | number; chanDoan: string; trangThaiHienTai: string }) => {
    return axiosClient.post('/hoso', payload);
  }
};
