import { Request, Response } from 'express';
import { HoSoService } from '../services/hoSoService';

export const createHoSoBenhAn = async (req: Request, res: Response) => {
  try {
    const data = await HoSoService.createHoSoBenhAn(req.body);

    res.status(201).json({
      message: 'Tạo hồ sơ thành công!',
      data
    });

  } catch (error: any) {
    console.error("Lỗi tạo hồ sơ:", error);
    res.status(400).json({ message: error.message });
  }
};

export const updateHoSoBenhAn = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const data = await HoSoService.updateHoSoBenhAn(id, req.body);
    
    res.status(200).json({ 
      message: 'Cập nhật hồ sơ thành công!', 
      data 
    });
  } catch (error: any) {
    console.error("Lỗi cập nhật hồ sơ:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getListBacSi = async (req: Request, res: Response) => {
  try {
    const data = await HoSoService.getListBacSi();

    res.status(200).json({
      message: 'Lấy danh sách bác sĩ thành công',
      data
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi lấy danh sách bác sĩ' });
  }
};

export const getListKTV = async (req: Request, res: Response) => {
  try {
    const data = await HoSoService.getListKTV();
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy danh sách KTV' });
  }
};