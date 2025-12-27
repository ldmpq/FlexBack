import { Request, Response } from 'express';
import { ThuocService } from '../services/thuocService';

export const getAllThuoc = async (req: Request, res: Response) => {
  try {
    const data = await ThuocService.getAllThuoc();
    res.status(200).json({ data });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createThuoc = async (req: Request, res: Response) => {
  try {
    const data = await ThuocService.createThuoc(req.body);
    res.status(201).json({ message: "Thêm thuốc thành công", data });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateThuoc = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const data = await ThuocService.updateThuoc(id, req.body);
    res.status(200).json({ message: "Cập nhật thành công", data });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteThuoc = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await ThuocService.deleteThuoc(id);
    res.status(200).json({ message: "Xóa thành công" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};