import { Request, Response } from 'express';
import { BaoCaoService } from '../services/baoCaoService';
import { AuthRequest } from '../middlewares/authMiddleware';

export const createBaoCao = async (req: Request, res: Response) => {
  try {
    const data = await BaoCaoService.createBaoCao(req.body);

    res.status(201).json({
      message: 'Gửi báo cáo luyện tập thành công!',
      data
    });

  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

export const getMyReports = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const data = await BaoCaoService.getReportsByPatient(userId);
    res.status(200).json({ data });
  }
  catch (error: any) {
    console.error("Lỗi khi lấy báo cáo của bệnh nhân:", error);
    res.status(400).json({ message: "Lỗi lấy lịch sử báo cáo" });
  }
};