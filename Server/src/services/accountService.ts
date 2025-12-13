import bcrypt from "bcryptjs";
import prisma from "../prismaClient";
import { AccountModel } from "../models/accountModel";

const ALLOWED_ROLES = ["BAC_SI", "KY_THUAT_VIEN", "ADMIN"];

const createDetailRecord = async (tx: any, maTaiKhoan: number, loaiTaiKhoan: string) => {
  switch (loaiTaiKhoan) {
    case "BAC_SI":
      return tx.bacSi.create({
        data: {
          maTaiKhoan,
          chuyenKhoa: "Chưa cập nhật",
          congTac: "Chưa cập nhật",
          ngayBatDau: new Date(),
        }
      });

    case "KY_THUAT_VIEN":
      return tx.kyThuatVien.create({
        data: {
          maTaiKhoan,
          chungChi: "Chưa cập nhật",
          ngayBatDau: new Date(),
        }
      });

    default:
      return null;
  }
};

export const AccountService = {
  async getAllStaff() {
    const data = await AccountModel.findAllStaff();
    return { status: 200, data };
  },

  async createStaffAccount(body: any) {
    const { tenTaiKhoan, matKhau, hoVaTen, email, loaiTaiKhoan, soDienThoai } = body;

    if (!tenTaiKhoan || !matKhau || !hoVaTen || !loaiTaiKhoan)
      return { status: 400, message: "Thiếu thông tin bắt buộc!" };

    if (!ALLOWED_ROLES.includes(loaiTaiKhoan))
      return { status: 400, message: "Loại tài khoản không hợp lệ." };

    const existing = await AccountModel.findByUsername(tenTaiKhoan);
    if (existing) return { status: 400, message: "Tên tài khoản đã tồn tại!" };

    const hashed = await bcrypt.hash(matKhau, 10);

    const result = await prisma.$transaction(async (tx) => {
      const newAcc = await AccountModel.createAccount(tx, {
        tenTaiKhoan,
        matKhau: hashed,
        hoVaTen,
        email,
        soDienThoai,
        loaiTaiKhoan,
      });

      await createDetailRecord(tx, newAcc.maTaiKhoan, loaiTaiKhoan);

      return newAcc;
    });

    return { status: 201, message: "Tạo tài khoản thành công!", data: result };
  },

  // Cập nhật thông tin tài khoản (chỉ Admin)
  async updateAccount(id: number, body: any) {
    const account = await AccountModel.findById(id);
    if (!account) return { status: 404, message: "Tài khoản không tồn tại!" };

    const updateData: any = {
      hoVaTen: body.hoVaTen,
      email: body.email,
      soDienThoai: body.soDienThoai,
      loaiTaiKhoan: body.loaiTaiKhoan,
    };

    if (body.matKhau) {
      updateData.matKhau = await bcrypt.hash(body.matKhau, 10);
    }

    await AccountModel.updateAccount(id, updateData);
    return { status: 200, message: "Cập nhật tài khoản thành công!" };
  },

  async deleteStaffAccount(id: number) {
    await AccountModel.deleteBacSi(id);
    await AccountModel.deleteKyThuatVien(id);
    await AccountModel.deleteAccount(id);

    return { status: 200, message: "Xóa tài khoản thành công!" };
  },

  async getAccountById(id: number) {
    const acc = await AccountModel.findById(id);
    if (!acc) return { status: 404, message: "Không tìm thấy tài khoản" };

    const { matKhau, ...cleanData } = acc;
    return { status: 200, data: cleanData };
  },
};
