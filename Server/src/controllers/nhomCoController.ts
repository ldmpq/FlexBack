import { Request, Response } from 'express';
import { NhomCoService } from '../services/nhomCoService';

export const getAllNhomCo = async (req: Request, res: Response) => {
  try {
    const data = await NhomCoService.getAllNhomCo();
    res.status(200).json({ data });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createNhomCo = async (req: Request, res: Response) => {
  try {
    const data = await NhomCoService.createNhomCo(req.body);
    res.status(201).json({ message: "Thêm nhóm cơ thành công", data });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateNhomCo = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const data = await NhomCoService.updateNhomCo(id, req.body);
    res.status(200).json({ message: "Cập nhật thành công", data });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteNhomCo = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await NhomCoService.deleteNhomCo(id);
    res.status(200).json({ message: "Xóa thành công" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};