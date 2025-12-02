import { Request, Response } from 'express';
import prisma from '../prismaClient';

// POST /api/lotrinh
export const createLoTrinh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      maMucTieu, 
      tenLoTrinh, 
      thoiGianBatDau, 
      thoiGianKetThuc, 
      ghiChu,
      maKyThuatVien
    } = req.body;

    // Kiểm tra mục tiêu tồn tại
    const mucTieu = await prisma.mucTieuDieuTri.findUnique({
      where: { maMucTieu: parseInt(maMucTieu) }
    });

    if (!mucTieu) {
      res.status(404).json({ message: 'Mục tiêu điều trị không tồn tại!' });
      return;
    }

    const newLoTrinh = await prisma.loTrinhDieuTri.create({
      data: {
        maMucTieu: parseInt(maMucTieu),
        tenLoTrinh,
        maKyThuatVien: maKyThuatVien || null,
        thoiGianBatDau: thoiGianBatDau ? new Date(thoiGianBatDau) : new Date(),
        thoiGianKetThuc: thoiGianKetThuc ? new Date(thoiGianKetThuc) : null,
        ghiChu
      }
    });

    res.status(201).json({
      message: 'Tạo lộ trình điều trị thành công!',
      data: newLoTrinh
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi hệ thống!', error });
  }
};