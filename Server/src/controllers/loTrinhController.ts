import { Request, Response } from "express";
import { LoTrinhService } from "../services/loTrinhService";

export const createLoTrinh = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await LoTrinhService.createLoTrinh(req.body);

    res.status(result.status).json({
      message: result.message,
      data: result.data ?? null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi hệ thống!", error });
  }
};
