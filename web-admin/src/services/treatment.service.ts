import axiosClient from '../utils/axiosClient';
import type { BaiTap, BaiTapConfig, HoSo, KTVOption } from '../types/treatment.type';

export const treatmentService = {
  getPatients: async (): Promise<HoSo[]> => {
    const res: any = await axiosClient.get('/users/benh-nhan');
    const patients = res.data.data || res.data;
    
    // Transform data: Flatten structure cho UI
    const allHoSo: HoSo[] = [];
    patients.forEach((p: any) => {
      const patientName = p.hoVaTen || p.TaiKhoan?.hoVaTen || "Chưa cập nhật tên";
      const benhNhanData = p.BenhNhan || p.benhNhan;
      if (benhNhanData) {
        const benhNhanDetail = Array.isArray(benhNhanData) ? benhNhanData[0] : benhNhanData;
        if (benhNhanDetail) {
          const listHoSo = benhNhanDetail.HOSOSO_BENHAN || benhNhanDetail.HoSoBenhAn || [];
          listHoSo.forEach((hs: any) => {
            allHoSo.push({
              ...hs,
              tenBenhNhan: patientName,
              BenhNhan: { TaiKhoan: { hoVaTen: patientName } }
            });
          });
        }
      }
    });
    return allHoSo;
  },

  getTreatmentDetail: async (maHoSo: number): Promise<HoSo> => {
    const res: any = await axiosClient.get(`/treatment/${maHoSo}`);
    return res.data.data || res.data;
  },

  getExercises: async (): Promise<BaiTap[]> => {
    const res: any = await axiosClient.get('/exercises');
    return res.data.data || [];
  },

  getTechnicians: async (): Promise<KTVOption[]> => {
    const res: any = await axiosClient.get('/treatment/technicians/list');
    return res.data.data || res.data;
  },

  createGoal: async (data: { maHoSo: number; noiDung: string; mucDoUuTien: string; ngayDatMucTieu: string }) => {
    return axiosClient.post('/treatment/muctieu', data);
  },

  deleteGoal: async (maMucTieu: number) => {
    const response = await axiosClient.delete(`/treatment/muctieu/${maMucTieu}`); 
    return response.data;
  },

  createRoute: async (data: { maMucTieu: number; tenLoTrinh: string; maKyThuatVien: string; thoiGianBatDau: string; thoiGianKetThuc: string; ghiChu: string }) => {
    return axiosClient.post('/treatment/lotrinh', data);
  },

  deleteRoute: async (maLoTrinh: number) => {
    const response = await axiosClient.delete(`/treatment/lotrinh/${maLoTrinh}`);
    return response.data;
  },

  saveRouteExercises: async (maLoTrinh: number, exercises: BaiTapConfig[]) => {
    return axiosClient.post(`/treatment/lotrinh/${maLoTrinh}/exercises`, exercises);
  }
};