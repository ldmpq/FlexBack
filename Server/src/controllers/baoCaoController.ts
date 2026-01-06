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

// [Admin] Lấy tất cả báo cáo
export const getAllReports = async (req: Request, res: Response) => {
  try {
    const data = await BaoCaoService.getAllReports();
    res.status(200).json({ data });
  } catch (error) {
    console.error("Lỗi lấy danh sách báo cáo:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// [Admin] Lấy chi tiết
export const getReportDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await BaoCaoService.getReportDetail(Number(id));
    if (!data) return res.status(404).json({ message: "Không tìm thấy" });
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// [Admin] Gửi phản hồi
export const sendFeedback = async (req: Request, res: Response) => {
  try {
    const { maHoSo, chiTiet, thangDiem } = req.body;
    await BaoCaoService.createFeedback(Number(maHoSo), chiTiet, thangDiem);
    res.status(201).json({ message: "Gửi phản hồi thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi gửi phản hồi" });
  }
};

export const getMyFeedback = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const data = await BaoCaoService.getFeedbackByPatient(userId);

    const formattedData = data.map(item => ({
      maThongBao: item.maDanhGia,
      noiDung: item.chiTiet,
      ngayTao: item.ngayDanhGia,
      thangDiem: item.thangDiem,
      daDoc: item.daDoc
    }));

    res.status(200).json({ data: formattedData });
  } catch (error) {
    console.error("Lỗi lấy đánh giá:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};