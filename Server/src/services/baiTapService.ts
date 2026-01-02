import prisma from '../prismaClient';
import { CreateExerciseDTO } from '../models/baiTapModel';

export class BaiTapService {
  // 1. Lấy nhóm cơ
  static async getNhomCo() {
    return prisma.nhomCo.findMany();
  }

  // 2. Lấy danh sách bài tập
  static async getExercises() {
  const data = await prisma.baiTapPhucHoi.findMany({
    include: {
      NhomCo: { select: { tenNhomCo: true } }
    }
  });

  return data.map(item => ({
    ...item,
    NHOM_CO: item.NhomCo
  }));
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

  // 5. Cập nhật bài tập
  static async updateExercise(id: number, data: any, file: Express.Multer.File | undefined) {
  // Kiểm tra tồn tại
  const exists = await prisma.baiTapPhucHoi.findUnique({ where: { maBaiTap: id } });
  if (!exists) throw new Error('Bài tập không tồn tại');

  // Chuẩn bị dữ liệu update
  let updateData: any = {
    tenBaiTap: data.tenBaiTap,
    moTaBaiTap: data.moTaBaiTap,
    mucDo: data.mucDo,
    dungCuCanThiet: data.dungCuCanThiet,
    maNhomCo: data.maNhomCo ? Number(data.maNhomCo) : undefined,
  };

  // Nếu có file mới, cập nhật đường dẫn video
  if (file) {
    // Logic lưu đường dẫn file (ví dụ: '/uploads/videos/' + file.filename)
    updateData.videoHuongDan = `/uploads/${file.filename}`; 
  }

  // Thực hiện update
  return await prisma.baiTapPhucHoi.update({
    where: { maBaiTap: id },
    data: updateData
  });
}
}
