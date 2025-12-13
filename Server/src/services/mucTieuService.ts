import { MucTieuModel } from "../models/mucTieuModel";

export const MucTieuService = {
  async createMucTieu(body: any) {
    const { maHoSo, noiDung, ngayDatMucTieu } = body;

    // Kiểm tra hồ sơ tồn tại hay không
    const hoSo = await MucTieuModel.findHoSoById(parseInt(maHoSo));

    if (!hoSo) {
      return {
        status: 404,
        message: "Hồ sơ bệnh án không tồn tại!"
      };
    }

    // Tạo mục tiêu mới
    const newMucTieu = await MucTieuModel.createMucTieu({
      maHoSo: parseInt(maHoSo),
      noiDung,
      trangThai: "Chưa hoàn thành",
      ngayDatMucTieu: ngayDatMucTieu ? new Date(ngayDatMucTieu) : new Date()
    });

    return {
      status: 201,
      message: "Đã thiết lập mục tiêu điều trị!",
      data: newMucTieu
    };
  }
};
