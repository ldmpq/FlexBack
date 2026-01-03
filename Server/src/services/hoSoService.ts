// server/src/services/hoSoService.ts
import prisma from '../prismaClient';
import { CreateHoSoDTO } from '../models/hoSoModel';

export class HoSoService {
  static async createHoSoBenhAn(data: CreateHoSoDTO) {
    const { maBenhNhan, maBacSi, chanDoan, trangThaiHienTai, maKyThuatVien } = data;

    // Log kiểm tra dữ liệu đầu vào
    console.log("Dữ liệu nhận được:", { maBenhNhan, maKyThuatVien });

    if (!maBenhNhan || !chanDoan) {
      throw new Error('Thiếu thông tin bắt buộc (Mã bệnh nhân hoặc Chẩn đoán)!');
    }

    let phanCongData = undefined;

    if (maKyThuatVien) {
      let ktvFound = null;
      const inputString = maKyThuatVien.toString().trim();
      const inputId = parseInt(inputString);

      if (!isNaN(inputId)) {
        ktvFound = await prisma.kyThuatVien.findFirst({ where: { maKyThuatVien: inputId } });
        if (!ktvFound) {
          ktvFound = await prisma.kyThuatVien.findFirst({ where: { maTaiKhoan: inputId } });
        }
      } else {
        console.log(`🔍 Đang tìm KTV theo tên: "${inputString}"`);
        ktvFound = await prisma.kyThuatVien.findFirst({
          where: {
            TaiKhoan: {
              hoVaTen: {
                contains: inputString,
              }
            }
          }
        });
      }

      if (ktvFound) {
        console.log(`✅ Đã tìm thấy KTV ID: ${ktvFound.maKyThuatVien}`);
        phanCongData = {
          create: {
            maKyThuatVien: ktvFound.maKyThuatVien,
            ngayBatDau: new Date(),
            ngayKetThuc: null
          }
        };
      } else {
        console.log(`❌ Không tìm thấy KTV nào khớp với thông tin: ${inputString}`);
      }
    }

    const newHoSo = await prisma.hoSoBenhAn.create({
      data: {
        maBenhNhan: parseInt(maBenhNhan.toString()),
        maBacSi: maBacSi ? parseInt(maBacSi.toString()) : null,
        chanDoan,
        trangThaiHienTai,
        ngayLapHoSo: new Date(),
        PhanCong: phanCongData
      },
      include: {
        PhanCong: true
      }
    });

    return newHoSo;
  }

  static async getListBacSi() { 
    return prisma.bacSi.findMany({ include: { TaiKhoan: { select: { maTaiKhoan: true, hoVaTen: true } } } }); 
  }

  static async getListKTV() { 
    return prisma.kyThuatVien.findMany({ include: { TaiKhoan: { select: { maTaiKhoan: true, hoVaTen: true } } } }); 
  }
}