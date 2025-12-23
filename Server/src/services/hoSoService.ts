import prisma from '../prismaClient';
import { CreateHoSoDTO } from '../models/hoSoModel';

export class HoSoService {

  // Tạo hồ sơ bệnh án
  static async createHoSoBenhAn(data: CreateHoSoDTO) {
    const { maBenhNhan, maBacSi, chanDoan, trangThaiHienTai } = data;

    // Validate
    if (!maBenhNhan || !chanDoan) {
      throw new Error('Thiếu thông tin bắt buộc (Mã bệnh nhân hoặc Chẩn đoán)!');
    }

    // Tạo hồ sơ
    const newHoSo = await prisma.hoSoBenhAn.create({
      data: {
        maBenhNhan: parseInt(maBenhNhan),
        maBacSi: maBacSi ? parseInt(maBacSi) : null,
        chanDoan,
        trangThaiHienTai,
        ngayLapHoSo: new Date()
      }
    });

    return newHoSo;
  }

  // Lấy danh sách bác sĩ
  static async getListBacSi() {
    return prisma.bacSi.findMany({
      include: {
        TaiKhoan: {
          select: { maTaiKhoan: true, hoVaTen: true }
        }
      }
    });
  }
}