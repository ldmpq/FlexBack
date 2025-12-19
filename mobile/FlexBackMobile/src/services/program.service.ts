import axiosClient from '../utils/axiosClient';
import { ProgramData } from '../types/program.type';

export const programService = {
  getMyProgram: async (): Promise<ProgramData | null> => {
    try {
      console.log("1. Đang gọi /auth/me để lấy ID hồ sơ...");
      const meRes = await axiosClient.get('/auth/me');
      const user = meRes.data.data;

      const benhNhan = user.BenhNhan?.[0];

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
      console.log("2. Tìm thấy maHoSo:", maHoSo, "- Đang gọi API lấy lộ trình...");

      const res = await axiosClient.get(`/treatment/${maHoSo}`);
      console.log("3. Lấy dữ liệu lộ trình thành công!");

      return res.data.data;
    } catch (error) {
      console.error("Lỗi trong quá trình lấy lộ trình:", error);
      return null;
    }
  }
};