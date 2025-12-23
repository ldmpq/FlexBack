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
}