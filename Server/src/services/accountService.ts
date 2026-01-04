import bcrypt from "bcryptjs";
import prisma from "../prismaClient";
import { AccountModel } from "../models/accountModel";

const ALLOWED_ROLES = ["BAC_SI", "KY_THUAT_VIEN", "ADMIN"];

const createDetailRecord = async (tx: any, maTaiKhoan: number, loaiTaiKhoan: string, data: any) => {
  switch (loaiTaiKhoan) {
    case "BAC_SI":
      return tx.bacSi.create({
        data: {
          maTaiKhoan,
          chuyenKhoa: data.chuyenKhoa || "Chưa cập nhật",
          congTac: data.congTac || "Chưa cập nhật",
          ngayBatDau: new Date(),
        }
      });

    case "KY_THUAT_VIEN":
      return tx.kyThuatVien.create({
        data: {
          maTaiKhoan,
          chungChi: data.chungChi || "Chưa cập nhật",
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
    const { tenTaiKhoan, matKhau, hoVaTen, email, loaiTaiKhoan, soDienThoai, chuyenKhoa, congTac, chungChi } = body;

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

      await createDetailRecord(tx, newAcc.maTaiKhoan, loaiTaiKhoan, body);

      return newAcc;
    });

    return { status: 201, message: "Tạo tài khoản thành công!", data: result };
  },

  async updateAccount(id: number, body: any) {
    const account = await AccountModel.findById(id);
    if (!account) return { status: 404, message: "Tài khoản không tồn tại!" };

    const updateData: any = {
      hoVaTen: body.hoVaTen,
      email: body.email,
      soDienThoai: body.soDienThoai,
    };

    if (body.matKhau) {
      updateData.matKhau = await bcrypt.hash(body.matKhau, 10);
    }

    // Dùng Transaction để update cả 2 bảng cùng lúc
    await prisma.$transaction(async (tx) => {
      // 1. Update bảng chính
      await tx.taiKhoan.update({
        where: { maTaiKhoan: id },
        data: updateData
      });

      // 2. Update bảng phụ tùy theo Role
      if (account.loaiTaiKhoan === 'BAC_SI') {
        await tx.bacSi.upsert({
          where: { maTaiKhoan: id },
          update: {
            chuyenKhoa: body.chuyenKhoa,
            congTac: body.congTac
          },
          create: {
            maTaiKhoan: id,
            chuyenKhoa: body.chuyenKhoa || "Chưa cập nhật",
            congTac: body.congTac || "Chưa cập nhật",
            ngayBatDau: new Date()
          }
        });
      } else if (account.loaiTaiKhoan === 'KY_THUAT_VIEN') {
        await tx.kyThuatVien.upsert({
          where: { maTaiKhoan: id },
          update: {
            chungChi: body.chungChi
          },
          create: {
            maTaiKhoan: id,
            chungChi: body.chungChi || "Chưa cập nhật",
            ngayBatDau: new Date()
          }
        });
      }
    });

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