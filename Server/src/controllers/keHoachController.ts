// src/controllers/keHoachController.ts
import { Request, Response } from 'express';
import prisma from '../prismaClient';
import { AuthRequest } from '../middlewares/authMiddleware';

// 1. Tạo Kế hoạch điều trị (Nằm trong 1 Lộ trình điều trị)
// POST /api/dieutri/kehoach
export const createKeHoach = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      maLoTrinh, 
      tenKeHoach, 
      moTa, 
      thoiGianBatDau, 
      thoiGianKetThuc 
    } = req.body;

    // Kiểm tra lộ trình tồn tại hay chưa?
    const loTrinh = await prisma.loTrinhDieuTri.findUnique({
      where: { maLoTrinh: parseInt(maLoTrinh) }
    });

    if (!loTrinh) {
      res.status(404).json({ message: 'Lộ trình không tồn tại!' });
      return;
    }

    const newKeHoach = await prisma.keHoachDieuTri.create({
      data: {
        maLoTrinh: parseInt(maLoTrinh),
        tenKeHoach,
        moTa,
        thoiGianBatDau: thoiGianBatDau ? new Date(thoiGianBatDau) : new Date(),
        thoiGianKetThuc: thoiGianKetThuc ? new Date(thoiGianKetThuc) : null,
      }
    });

    res.status(201).json({
      message: 'Tạo kế hoạch điều trị thành công!',
      data: newKeHoach
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi hệ thống!', error });
  }
};

// 2. Thêm bài tập vào Kế hoạch (Chi tiết kế hoạch)
// POST /api/dieutri/kehoach/them-bai-tap
export const addBaiTapToKeHoach = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      maKeHoach, 
      maBaiTap, 
      sets, 
      reps, 
      cuongDo, 
      ghiChu 
    } = req.body;

    // Kiểm tra kế hoạch có tồn tại không
    const keHoach = await prisma.keHoachDieuTri.findUnique({
      where: { maKeHoach: parseInt(maKeHoach) }
    });

    if (!keHoach) {
      res.status(404).json({ message: 'Kế hoạch không tồn tại!' });
      return;
    }

    // Tạo chi tiết (Gán bài tập)
    const chiTiet = await prisma.chiTietKeHoach.create({
      data: {
        maKeHoach: parseInt(maKeHoach),
        maBaiTap: parseInt(maBaiTap),
        sets: parseInt(sets),
        reps: parseInt(reps),
        cuongDo,
        ghiChu
      }
    });

    res.status(201).json({
      message: 'Đã thêm bài tập vào kế hoạch!',
      data: chiTiet
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi hệ thống!', error });
  }
};

// 3. Lấy danh sách bài tập CẦN LÀM HÔM NAY
// GET /api/dieutri/bai-tap-hom-nay
export const getBaiTapHomNay = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user?.id;
    const today = new Date();

    // Tìm tất cả các Kế Hoạch đang có hiệu lực trong ngày hôm nay của User này
    const keHoachHienTai = await prisma.keHoachDieuTri.findMany({
      where: {
        // 1. Thời gian hiện tại phải nằm trong khoảng Bắt đầu - Kết thúc của kế hoạch
        thoiGianBatDau: { lte: today },
        thoiGianKetThuc: { gte: today },
        // 2. Kế hoạch này phải thuộc về Lộ trình -> Mục tiêu -> Hồ sơ -> Bệnh nhân -> User đang login
        LoTrinhDieuTri: {
          MucTieuDieuTri: {
            HoSoBenhAn: {
              BenhNhan: {
                maTaiKhoan: userId
              }
            }
          }
        }
      },
      // Lấy kèm thông tin chi tiết bài tập
      include: {
        ChiTietKeHoach: {
          include: {
            BaiTapPhucHoi: true // Lấy luôn tên, video bài tập
          }
        }
      }
    });

    res.status(200).json({
      message: 'Lấy danh sách bài tập hôm nay thành công!',
      data: keHoachHienTai
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi hệ thống!', error });
  }
};