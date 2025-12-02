import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. Lấy danh sách Nhóm cơ (để hiển thị trong dropdown lọc/thêm mới)
export const getNhomCo = async (req: Request, res: Response): Promise<void> => {
  try {
    const nhomCos = await prisma.nhomCo.findMany();
    res.status(200).json({ data: nhomCos });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy danh sách nhóm cơ' });
  }
};

// 2. Lấy danh sách Bài tập (kèm tên nhóm cơ)
export const getExercises = async (req: Request, res: Response): Promise<void> => {
  try {
    const exercises = await prisma.baiTapPhucHoi.findMany({
      include: {
        NhomCo: {
          select: { tenNhomCo: true } // Lấy kèm tên nhóm cơ để hiển thị
        }
      },
      orderBy: { maBaiTap: 'desc' } // Bài mới nhất lên đầu
    });
    res.status(200).json({ data: exercises });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy danh sách bài tập' });
  }
};

// 3. Thêm bài tập mới
export const createExercise = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tenBaiTap, maNhomCo, moTaBaiTap, mucDo, dungCuCanThiet, videoHuongDan } = req.body;

    if (!tenBaiTap || !maNhomCo) {
      res.status(400).json({ message: 'Tên bài tập và Nhóm cơ là bắt buộc!' });
      return;
    }

    const newExercise = await prisma.baiTapPhucHoi.create({
      data: {
        tenBaiTap,
        maNhomCo: parseInt(maNhomCo),
        moTaBaiTap,
        mucDo,
        dungCuCanThiet,
        videoHuongDan
      }
    });

    res.status(201).json({ message: 'Thêm bài tập thành công!', data: newExercise });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi thêm bài tập' });
  }
};

// 4. Xóa bài tập
export const deleteExercise = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.baiTapPhucHoi.delete({
      where: { maBaiTap: parseInt(id) }
    });
    res.status(200).json({ message: 'Xóa bài tập thành công!' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa bài tập (Có thể bài tập đang được sử dụng trong liệu trình)' });
  }
};