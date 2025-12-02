import { Request, Response } from 'express';
import prisma from '../prismaClient';

// POST /api/dieutri/baocao
export const createBaoCao = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      maKeHoach, 
      thoiLuong,   
      mucDoDau,    // Thang điểm 1-10
      danhGiaSoBo, 
      ngayLuyenTap 
    } = req.body;

    // 1. Kiểm tra kế hoạch có tồn tại không?
    const keHoach = await prisma.keHoachDieuTri.findUnique({
      where: { maKeHoach: parseInt(maKeHoach) }
    });

    if (!keHoach) {
      res.status(404).json({ message: 'Kế hoạch điều trị không tồn tại!' });
      return;
    }

    // 2. Lưu báo cáo vào DB
    const newBaoCao = await prisma.baoCaoLuyenTap.create({
      data: {
        maKeHoach: parseInt(maKeHoach),
        thoiLuong: parseInt(thoiLuong),
        mucDoDau: parseInt(mucDoDau),
        danhGiaSoBo: danhGiaSoBo,
        ngayLuyenTap: ngayLuyenTap ? new Date(ngayLuyenTap) : new Date()
      }
    });

    res.status(201).json({
      message: 'Gửi báo cáo luyện tập thành công!',
      data: newBaoCao
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi hệ thống!', error });
  }
};