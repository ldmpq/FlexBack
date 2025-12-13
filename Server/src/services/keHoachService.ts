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
}