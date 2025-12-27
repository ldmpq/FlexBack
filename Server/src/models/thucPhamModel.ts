import prisma from '../prismaClient';

export interface CreateThucPhamDTO {
  tenThucPham: string;
  chiTiet?: string;
}

export const ThucPhamModel = {
  findAll: () => {
    return prisma.camNangThucPham.findMany();
  },

  create: (data: any) => {
    return prisma.camNangThucPham.create({ data });
  },

  update: (id: number, data: any) => {
    return prisma.camNangThucPham.update({
      where: { maThucPham: id },
      data
    });
  },

  delete: (id: number) => {
    return prisma.camNangThucPham.delete({
      where: { maThucPham: id }
    });
  }
};