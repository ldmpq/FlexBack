import { Request, Response } from 'express';
import { BenhNhanService } from '../services/benhNhanService';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getMyAssignedPatients = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) return res.status(401).json({ message: 'Chưa đăng nhập' });

    const data = await BenhNhanService.getAssignedPatients(userId);
    res.status(200).json({ data });
  } catch (error) {
    console.error("Lỗi lấy danh sách phân công:", error);
    res.status(500).json({ message: "Lỗi hệ thống khi tải danh sách bệnh nhân" });
  }
};

export const getPatientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Thiếu ID bệnh nhân" });

    const data = await BenhNhanService.getPatientDetail(Number(id));

    if (!data) {
      return res.status(404).json({ message: "Không tìm thấy bệnh nhân" });
    }

    res.status(200).json({ data });
  } catch (error) {
    console.error("Lỗi lấy chi tiết bệnh nhân:", error);
    res.status(500).json({ message: "Lỗi Server" });
  }
};