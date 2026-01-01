import prisma from '../prismaClient';
import { CreateKeHoachDTO, AddBaiTapDTO } from '../models/keHoachModel';

export class KeHoachService {

  // Tạo kế hoạch điều trị
  static async createKeHoach(data: CreateKeHoachDTO) {
    const { maLoTrinh, tenKeHoach, moTa, thoiGianBatDau, thoiGianKetThuc } = data;

    // Kiểm tra lộ trình tồn tại
    const loTrinh = await prisma.loTrinhDieuTri.findUnique({
      where: { maLoTrinh: Number(maLoTrinh) }
    });

    if (!loTrinh) throw new Error("Lộ trình điều trị không tồn tại!");

    return prisma.keHoachDieuTri.create({
      data: {
        maLoTrinh: Number(maLoTrinh),
        tenKeHoach,
        moTa: moTa ?? null,
        thoiGianBatDau: thoiGianBatDau ? new Date(thoiGianBatDau) : new Date(),
        thoiGianKetThuc: thoiGianKetThuc ? new Date(thoiGianKetThuc) : null,
      }
    });
  }

  // Thêm bài tập vào kế hoạch
  static async addBaiTap(data: AddBaiTapDTO) {
    const { maKeHoach, maBaiTap, sets, reps, cuongDo, ghiChu } = data;

    const keHoach = await prisma.keHoachDieuTri.findUnique({
      where: { maKeHoach: Number(maKeHoach) }
    });

    if (!keHoach) throw new Error("Kế hoạch điều trị không tồn tại!");

    return prisma.chiTietKeHoach.create({
      data: {
        maKeHoach: Number(maKeHoach),
        maBaiTap: Number(maBaiTap),
        sets: sets ? Number(sets) : null,
        reps: reps ? Number(reps) : null,
        cuongDo: cuongDo ?? null,
        ghiChu: ghiChu ?? null,
      }
    });
  }

  // Lấy bài tập hôm nay
  static async getBaiTapHomNay(userId: number) {
    const today = new Date();

    return prisma.keHoachDieuTri.findMany({
      where: {
        thoiGianBatDau: { lte: today },
        thoiGianKetThuc: { gte: today },

        LoTrinhDieuTri: {
          MucTieuDieuTri: {
            HoSoBenhAn: {
              BenhNhan: { maTaiKhoan: userId }
            }
          }
        }
      },
      include: {
        ChiTietKeHoach: {
          include: {
            BaiTapPhucHoi: true
          }
        }
      }
    });
  }

  static async completeKeHoach(maKeHoach: number, reportData: any) {
    // 1. Tìm Kế hoạch kèm theo các quan hệ cha (Lộ trình -> Mục tiêu)
    const keHoach = await prisma.keHoachDieuTri.findUnique({
      where: { maKeHoach: Number(maKeHoach) },
      include: {
        LoTrinhDieuTri: {
          include: {
            MucTieuDieuTri: true // Include Mục tiêu để lấy maHoSo
          }
        }
      }
    });

    if (!keHoach) throw new Error("Kế hoạch không tồn tại!");

    // 2. Truy xuất maHoSo từ chuỗi quan hệ
    const loTrinh = keHoach.LoTrinhDieuTri;
    if (!loTrinh) throw new Error("Lỗi dữ liệu: Kế hoạch không thuộc lộ trình nào!");

    const mucTieu = loTrinh.MucTieuDieuTri;
    if (!mucTieu) throw new Error("Lỗi dữ liệu: Lộ trình không thuộc mục tiêu nào!");

    const maHoSo = mucTieu.maHoSo;
    if (!maHoSo) throw new Error("Lỗi dữ liệu: Mục tiêu không gắn với hồ sơ nào!");

    // 3. Cập nhật trạng thái HỒ SƠ (HoSoBenhAn)
    return prisma.$transaction(async (tx) => {
      
      const updatedProfile = await tx.hoSoBenhAn.update({
        where: { maHoSo: maHoSo },
        data: { 
          // Cập nhật trường trạng thái của hồ sơ (khớp với schema.prisma)
          trangThaiHienTai: 'KetThuc' 
        }
      });
      return updatedProfile;
    });
  }
}