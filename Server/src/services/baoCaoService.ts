import prisma from '../prismaClient';
import { CreateBaoCaoDTO } from '../models/baoCaoModel';

export class BaoCaoService {

  static async createBaoCao(data: CreateBaoCaoDTO) {
    const { maKeHoach, thoiLuong, mucDoDau, danhGiaSoBo, ngayLuyenTap } = data;

    // 1. Kiểm tra kế hoạch tồn tại
    const keHoach = await prisma.keHoachDieuTri.findUnique({
      where: { maKeHoach: parseInt(maKeHoach) }
    });

    if (!keHoach) {
      throw new Error('Kế hoạch điều trị không tồn tại!');
    }

    // 2. Lưu báo cáo
    const newBaoCao = await prisma.baoCaoLuyenTap.create({
      data: {
        maKeHoach: parseInt(maKeHoach),
        thoiLuong: parseInt(thoiLuong),
        mucDoDau: parseInt(mucDoDau),
        danhGiaSoBo,
        ngayLuyenTap: ngayLuyenTap ? new Date(ngayLuyenTap) : new Date()
      }
    });

    return newBaoCao;
  }

  static async getReportsByPatient(userId: number) {
    // 1. Tìm mã bệnh nhân từ userId
    const benhNhan = await prisma.benhNhan.findFirst({
      where: { maTaiKhoan: userId }
    });

    if (!benhNhan) return [];

    // 2. Lấy tất cả báo cáo liên quan đến bệnh nhân
    // Logic: BaoCao -> KeHoach -> LoTrinh -> MucTieu -> HoSo -> BenhNhan
    // Truy vấn ngược từ BaoCaoLuyenTap
    const reports = await prisma.baoCaoLuyenTap.findMany({
      where: {
        KeHoachDieuTri: {
          LoTrinhDieuTri: {
            MucTieuDieuTri: {
              HoSoBenhAn: {
                maBenhNhan: benhNhan.maBenhNhan
              }
            }
          }
        }
      },
      include: {
        KeHoachDieuTri: {
          select: { 
            tenKeHoach: true,
            LoTrinhDieuTri: {
              select: { tenLoTrinh: true }
            }
          }
        }
      },
      orderBy: { ngayLuyenTap: 'desc' } // Mới nhất lên đầu
    });

    return reports;
  }
}