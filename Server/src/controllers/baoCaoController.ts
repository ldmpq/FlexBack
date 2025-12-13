import { Request, Response } from 'express';
import { BaoCaoService } from '../services/baoCaoService';

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