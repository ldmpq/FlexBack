import axiosClient from '../utils/axiosClient';
import { ProgramData } from '../types/program.type';

export const programService = {
  getMyProgram: async (): Promise<ProgramData | null> => {
    try {
      const meRes = await axiosClient.get('/auth/me');
      const user = meRes.data.data;

      const benhNhan = user.BenhNhan;

      if (!benhNhan) {
        console.warn("User không phải là bệnh nhân hoặc chưa có data BenhNhan");
        return null;
      }

      const hoSo = benhNhan.HoSoBenhAn?.[0];

      if (!hoSo) {
        console.warn("Bệnh nhân chưa có hồ sơ bệnh án nào.");
        return null;
      }

      const maHoSo = hoSo.maHoSo;

      const res = await axiosClient.get(`/treatment/${maHoSo}`);

      return res.data.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
};