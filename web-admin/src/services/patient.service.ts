import axiosClient from '../utils/axiosClient';
import type { Patient } from '../types/patient.type';

export const patientService = {
  // Lấy danh sách bệnh nhân
  getPatients: async (): Promise<Patient[]> => {
    const res: any = await axiosClient.get('/users/benh-nhan');
    // Xử lý linh hoạt data trả về
    return res.data.data || res.data || [];
  }
};