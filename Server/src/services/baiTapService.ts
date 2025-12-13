import prisma from '../prismaClient';
import { CreateExerciseDTO } from '../models/baiTapModel';

export class BaiTapService {

  // 1. Lấy nhóm cơ
  static async getNhomCo() {
    return prisma.nhomCo.findMany();
  }

  // 2. Lấy danh sách bài tập
  static async getExercises() {
    return prisma.baiTapPhucHoi.findMany({
      include: {
        NhomCo: {
          select: { tenNhomCo: true }
        }
      },
      orderBy: { maBaiTap: 'desc' }
    });
  }

  // 3. Tạo bài tập mới
  static async createExercise(data: CreateExerciseDTO, uploadedFile?: Express.Multer.File) {
    const { tenBaiTap, maNhomCo, moTaBaiTap, mucDo, dungCuCanThiet, videoLink } = data;

    if (!tenBaiTap || !maNhomCo) {
      throw new Error('Tên bài tập và Nhóm cơ là bắt buộc!');
    }

    let videoPath = null;

    if (videoLink) videoPath = videoLink;
    else if (uploadedFile) videoPath = `/uploads/videos/${uploadedFile.filename}`;

    const newExercise = await prisma.baiTapPhucHoi.create({
      data: {
        tenBaiTap,
        maNhomCo: parseInt(maNhomCo),
        moTaBaiTap,
        mucDo,
        dungCuCanThiet,
        videoHuongDan: videoPath
      }
    });

    return newExercise;
  }

  // 4. Xóa bài tập
  static async deleteExercise(id: number) {
    return prisma.baiTapPhucHoi.delete({
      where: { maBaiTap: id }
    });
  }
}
