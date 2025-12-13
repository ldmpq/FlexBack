import { Request, Response } from "express";
import { MucTieuService } from "../services/mucTieuService";

export const createMucTieu = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await MucTieuService.createMucTieu(req.body);

    res.status(result.status).json({
      message: result.message,
      data: result.data ?? null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Lỗi hệ thống!",
      error
    });
  }
};
