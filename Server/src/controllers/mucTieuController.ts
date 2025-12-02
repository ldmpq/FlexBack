import { Request, Response } from 'express';
import prisma from '../prismaClient';

// POST /api/muctieu
export const createMucTieu = async (req: Request, res: Response): Promise<void> => {
  try {
    const { maHoSo, noiDung, ngayDatMucTieu } = req.body;

    // Kiểm tra xem hồ sơ có tồn tại không
    const hoSo = await prisma.hoSoBenhAn.findUnique({
      where: { maHoSo: parseInt(maHoSo) }
    });

    if (!hoSo) {
      res.status(404).json({ message: 'Hồ sơ bệnh án không tồn tại!' });
      return;
    }

    // Tạo mục tiêu mới
    const newMucTieu = await prisma.mucTieuDieuTri.create({
      data: {
        maHoSo: parseInt(maHoSo),
        noiDung: noiDung,
        trangThai: 'Chưa hoàn thành', // Default
        ngayDatMucTieu: ngayDatMucTieu ? new Date(ngayDatMucTieu) : new Date(),
      }
    });

    res.status(201).json({
      message: 'Đã thiết lập mục tiêu điều trị!',
      data: newMucTieu
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi hệ thống!', error });
  }
};