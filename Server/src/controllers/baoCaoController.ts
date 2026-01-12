import { Request, Response } from 'express';
import { BaoCaoService } from '../services/baoCaoService';
import { AuthRequest } from '../middlewares/authMiddleware';
import prisma from '../prismaClient';

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
      daDoc: item.daDoc,
      loaiDanhGia: item.loaiDanhGia
    }));

    res.status(200).json({ data: formattedData });
  } catch (error) {
    console.error("Lỗi lấy đánh giá:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// [KTV] Kỹ thuật viên gửi đánh giá
export const sendKTVEvaluation = async (req: Request | any, res: Response) => {
  try {
    const { maHoSo, ketQua, nhanXet } = req.body;
    const userId = req.user?.id; // Lấy ID từ token

    // 1. Tìm thông tin KTV từ User ID
    const ktv = await prisma.kyThuatVien.findFirst({
      where: { maTaiKhoan: userId }
    });

    if (!ktv) {
      return res.status(403).json({ message: "Bạn không có quyền Kỹ thuật viên!" });
    }

    // 2. Gọi service tạo đánh giá
    await BaoCaoService.createKTVEvaluation({
      maHoSo: Number(maHoSo),
      maKTV: ktv.maKyThuatVien,
      ketQua: Boolean(ketQua),
      nhanXet: nhanXet
    });

    res.status(201).json({ message: "Gửi đánh giá tiến độ thành công!" });
  } catch (error) {
    console.error("Lỗi gửi đánh giá KTV:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getKTVEvaluations = async (req: Request, res: Response) => {
  try {
    const data = await BaoCaoService.getAllKTVEvaluations();
    res.status(200).json({ data });
  } catch (error) {
    console.error("Lỗi lấy danh sách KTV đánh giá:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};