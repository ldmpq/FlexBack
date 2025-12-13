import { LoTrinhModel } from "../models/loTrinhModel";

export const LoTrinhService = {
  async createLoTrinh(body: any) {
    const { 
      maMucTieu, 
      tenLoTrinh, 
      thoiGianBatDau, 
      thoiGianKetThuc, 
      ghiChu,
      maKyThuatVien
    } = body;

    // Kiểm tra mục tiêu tồn tại
    const mucTieu = await LoTrinhModel.findMucTieuById(parseInt(maMucTieu));
    if (!mucTieu) {
      return { status: 404, message: "Mục tiêu điều trị không tồn tại!" };
    }

    // Tạo lộ trình
    const newLoTrinh = await LoTrinhModel.createLoTrinh({
      maMucTieu: parseInt(maMucTieu),
      tenLoTrinh,
      maKyThuatVien: maKyThuatVien || null,
      thoiGianBatDau: thoiGianBatDau ? new Date(thoiGianBatDau) : new Date(),
      thoiGianKetThuc: thoiGianKetThuc ? new Date(thoiGianKetThuc) : null,
      ghiChu
    });

    return {
      status: 201,
      message: "Tạo lộ trình điều trị thành công!",
      data: newLoTrinh
    };
  }
};
