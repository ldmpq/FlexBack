import { Request, Response } from 'express';
import { BaiTapService } from '../services/baiTapService';

export const getNhomCo = async (req: Request, res: Response) => {
  try {
    const data = await BaiTapService.getNhomCo();
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy danh sách nhóm cơ' });
  }
};

export const getExercises = async (req: Request, res: Response) => {
  try {
    const data = await BaiTapService.getExercises();
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy danh sách bài tập' });
  }
};

export const createExercise = async (req: Request, res: Response) => {
  try {
    const uploadedFile = req.file;

    const newExercise = await BaiTapService.createExercise(req.body, uploadedFile);

    res.status(201).json({
      message: 'Thêm bài tập thành công!',
      data: newExercise
    });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

export const deleteExercise = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    await BaiTapService.deleteExercise(id);

    res.status(200).json({ message: 'Xóa bài tập thành công!' });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi xóa bài tập (Có thể bài tập đang được sử dụng trong liệu trình)'
    });
  }
};

export const updateExercise = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const uploadedFile = req.file; // Lấy file mới nếu người dùng upload lại video/ảnh

    // Gọi Service để xử lý update
    const updatedExercise = await BaiTapService.updateExercise(id, req.body, uploadedFile);

    res.status(200).json({
      message: 'Cập nhật bài tập thành công!',
      data: updatedExercise
    });
  } catch (error: any) {
    console.error("Lỗi cập nhật:", error);
    if (error.message === 'Bài tập không tồn tại') {
        return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Lỗi server khi cập nhật bài tập' });
  }
};