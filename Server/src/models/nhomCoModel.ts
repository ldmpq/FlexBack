import prisma from '../prismaClient';

export interface CreateNhomCoDTO {
  tenNhomCo: string;
  moTaNhomCo?: string;
}

export const NhomCoModel = {
  // Lấy tất cả nhóm cơ
  findAll: () => {
    return prisma.nhomCo.findMany({
      orderBy: { maNhomCo: 'asc' }
    });
  },

  // Lấy chi tiết 1 nhóm cơ
  findById: (id: number) => {
    return prisma.nhomCo.findUnique({
      where: { maNhomCo: id }
    });
  },

  // Tạo mới
  create: (data: any) => {
    return prisma.nhomCo.create({ data });
  },

  // Cập nhật
  update: (id: number, data: any) => {
    return prisma.nhomCo.update({
      where: { maNhomCo: id },
      data
    });
  },

  // Xóa
  delete: (id: number) => {
    return prisma.nhomCo.delete({
      where: { maNhomCo: id }
    });
  }
};