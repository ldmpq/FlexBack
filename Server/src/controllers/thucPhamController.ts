import { Request, Response } from 'express';
import { ThucPhamService } from '../services/thucPhamService';

export const getAllThucPham = async (req: Request, res: Response) => {
  try {
    const data = await ThucPhamService.getAllThucPham();
    res.status(200).json({ data });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createThucPham = async (req: Request, res: Response) => {
  try {
    const data = await ThucPhamService.createThucPham(req.body);
    res.status(201).json({ message: "Thêm thực phẩm thành công", data });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateThucPham = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const data = await ThucPhamService.updateThucPham(id, req.body);
    res.status(200).json({ message: "Cập nhật thành công", data });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteThucPham = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await ThucPhamService.deleteThucPham(id);
    res.status(200).json({ message: "Xóa thành công" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};