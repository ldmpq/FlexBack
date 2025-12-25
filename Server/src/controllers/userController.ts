import { Request, Response } from "express";
import { BenhNhanService } from "../services/userService";
import { UserService } from '../services/userService';
import { AuthRequest } from '../middlewares/authMiddleware';

// GET /api/users/benh-nhan
export const getAllBenhNhan = async (req: Request, res: Response) => {
    try {
        const data = await BenhNhanService.getAllBenhNhan();
        res.status(200).json({
            message: "Lấy danh sách bệnh nhân thành công!",
            data
        });
    } catch (error) {
        console.error("Lỗi getAllBenhNhan:", error);
        res.status(500).json({ message: "Lỗi hệ thống", error });
    }
};

// GET /api/users/benh-nhan/:id
export const getBenhNhanById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const benhNhan = await BenhNhanService.getBenhNhanById(id);

        if (!benhNhan) {
            return res.status(404).json({ message: "Không tìm thấy bệnh nhân" });
        }

        res.status(200).json({
            message: "Lấy thông tin chi tiết thành công!",
            data: benhNhan
        });

    } catch (error) {
        console.error("Lỗi getBenhNhanById:", error);
        res.status(500).json({ message: "Lỗi hệ thống!", error });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    await UserService.updatePatientProfile(userId, req.body);
    res.status(200).json({ message: "Cập nhật thông tin thành công!" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Lỗi cập nhật thông tin" });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const profile = await UserService.getPatientProfile(userId);

    if (!profile) {
      return res.status(404).json({ message: "Không tìm thấy hồ sơ điều trị" });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Lỗi getProfile:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};