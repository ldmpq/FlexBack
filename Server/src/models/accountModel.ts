import prisma from "../prismaClient";

export const AccountModel = {
  findAllStaff() {
    return prisma.taiKhoan.findMany({
      where: { loaiTaiKhoan: { in: ["BAC_SI", "KY_THUAT_VIEN", "ADMIN"] } },
      select: {
        maTaiKhoan: true,
        tenTaiKhoan: true,
        hoVaTen: true,
        email: true,
        soDienThoai: true,
        loaiTaiKhoan: true,
        ngayTaoTaiKhoan: true,
      },
      orderBy: { maTaiKhoan: "asc" },
    });
  },

  findByUsername(tenTaiKhoan: string) {
    return prisma.taiKhoan.findFirst({ where: { tenTaiKhoan } });
  },

  findById(maTaiKhoan: number) {
    return prisma.taiKhoan.findUnique({
      where: { maTaiKhoan },
      include: { BacSi: true, KyThuatVien: true }
    });
  },

  createAccount(tx: any, data: any) {
    return tx.taiKhoan.create({ data });
  },

  // Cập nhật thông tin tài khoản (chỉ Admin)
  updateAccount(id: number, data: any) {
    return prisma.taiKhoan.update({
      where: { maTaiKhoan: id },
      data,
    });
  },

  deleteAccount(id: number) {
    return prisma.taiKhoan.delete({ where: { maTaiKhoan: id } });
  },

  deleteBacSi(id: number) {
    return prisma.bacSi.deleteMany({ where: { maTaiKhoan: id } });
  },

  deleteKyThuatVien(id: number) {
    return prisma.kyThuatVien.deleteMany({ where: { maTaiKhoan: id } });
  },
};
