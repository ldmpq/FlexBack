import { Request, Response } from 'express';
import { KeHoachService } from '../services/keHoachService';
import { AuthRequest } from '../middlewares/authMiddleware';

export const createKeHoach = async (req: Request, res: Response) => {
  try {
    const data = await KeHoachService.createKeHoach(req.body);

    res.status(201).json({
      message: "Tạo kế hoạch điều trị thành công!",
      data
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const addBaiTapToKeHoach = async (req: Request, res: Response) => {
  try {
    const data = await KeHoachService.addBaiTap(req.body);

    res.status(201).json({
      message: "Đã thêm bài tập vào kế hoạch!",
      data
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getBaiTapHomNay = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user?.id;

    if (!userId) {
      res.status(401).json({ message: "Người dùng chưa đăng nhập!" });
      return;
    }

    const data = await KeHoachService.getBaiTapHomNay(userId);

    res.status(200).json({
      message: "Lấy danh sách bài tập hôm nay thành công!",
      data
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống", error });
  }
};

export const completeKeHoach = async (req: Request, res: Response) => {
  try {
    const { maKeHoach, ...reportData } = req.body;

    if (!maKeHoach) {
      return res.status(400).json({ message: "Thiếu mã kế hoạch!" });
    }

    const data = await KeHoachService.completeKeHoach(maKeHoach, reportData);

    res.status(200).json({
      message: "Đã cập nhật trạng thái hồ sơ thành công.",
      data
    });
  } catch (error: any) {
    console.error("Lỗi hoàn thành:", error);
    res.status(400).json({ message: error.message || "Lỗi xử lý" });
  }
};