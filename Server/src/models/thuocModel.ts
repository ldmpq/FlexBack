import prisma from '../prismaClient';

export interface CreateThuocDTO {
  tenThuoc: string;
  congDung?: string;
}

export const ThuocModel = {
  findAll: () => {
    return prisma.camNangThuoc.findMany();
  },
  
  create: (data: any) => {
    return prisma.camNangThuoc.create({ data });
  },

  update: (id: number, data: any) => {
    return prisma.camNangThuoc.update({
      where: { maThuoc: id },
      data
    });
  },

  delete: (id: number) => {
    return prisma.camNangThuoc.delete({
      where: { maThuoc: id }
    });
  }
};