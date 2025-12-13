import prisma from "../prismaClient";

export const MucTieuModel = {
  findHoSoById: (maHoSo: number) => {
    return prisma.hoSoBenhAn.findUnique({
      where: { maHoSo }
    });
  },

  createMucTieu: (data: any) => {
    return prisma.mucTieuDieuTri.create({
      data
    });
  }
};
