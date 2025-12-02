import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// API: Tạo hồ sơ bệnh án mới (Dành cho Bác sĩ tạo cho Bệnh nhân)
// POST /api/hoso
export const createHoSoBenhAn = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Lấy dữ liệu từ Frontend gửi lên (Form nhập liệu)
    const { maBenhNhan, maBacSi, chanDoan, trangThaiHienTai } = req.body;

    // Validate dữ liệu đầu vào
    if (!maBenhNhan || !chanDoan) {
      res.status(400).json({ message: 'Thiếu thông tin bắt buộc (Mã bệnh nhân hoặc Chẩn đoán)!' });
      return;
    }

    // 2. Tạo hồ sơ mới
    const newHoSo = await prisma.hoSoBenhAn.create({
      data: {
        maBenhNhan: parseInt(maBenhNhan),
        maBacSi: maBacSi ? parseInt(maBacSi) : null,
        chanDoan: chanDoan,
        trangThaiHienTai: trangThaiHienTai,
        ngayLapHoSo: new Date(),
      },
    });

    res.status(201).json({
      message: 'Tạo hồ sơ thành công!',
      data: newHoSo,
    });

  } catch (error) {
    console.error("Lỗi tạo hồ sơ:", error);
    res.status(500).json({ message: 'Lỗi hệ thống', error });
  }
};

// API: Lấy danh sách bác sĩ
export const getListBacSi = async (req: Request, res: Response): Promise<void> => {
  try {
    // Lấy danh sách bác sĩ để hiển thị trong dropdown
    const listBacSi = await prisma.bacSi.findMany({
      include: {
        TaiKhoan: {
          select: { maTaiKhoan: true, hoVaTen: true }
        }
      }
    });

    res.status(200).json({
      message: 'Lấy danh sách bác sĩ thành công',
      data: listBacSi
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi lấy danh sách bác sĩ' });
  }
};