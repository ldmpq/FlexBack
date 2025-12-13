import prisma from "../prismaClient";

export const LoTrinhModel = {
  findMucTieuById: (maMucTieu: number) => {
    return prisma.mucTieuDieuTri.findUnique({
      where: { maMucTieu }
    });
  },

  createLoTrinh: (data: any) => {
    return prisma.loTrinhDieuTri.create({ data });
  }
};
