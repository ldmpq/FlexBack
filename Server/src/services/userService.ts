import prisma from "../models/userModel";

export class BenhNhanService {
  // Lấy tất cả bệnh nhân kèm hồ sơ
  static async getAllBenhNhan() {
    return prisma.taiKhoan.findMany({
      where: { loaiTaiKhoan: "BENH_NHAN" },
      select: {
        maTaiKhoan: true,
        tenTaiKhoan: true,
        hoVaTen: true,
        email: true,
        soDienThoai: true,
        gioiTinh: true,
        ngaySinh: true,
        BenhNhan: {
          include: {
            HoSoBenhAn: {
              select: {
                maHoSo: true,
                ngayLapHoSo: true,
                chanDoan: true,
                trangThaiHienTai: true,
              },
              orderBy: { ngayLapHoSo: "desc" }
            }
          }
        }
      }
    });
  }

  // Lấy chi tiết bệnh nhân theo ID
  static async getBenhNhanById(id: number) {
    return prisma.taiKhoan.findUnique({
      where: { maTaiKhoan: id },
      select: {
        maTaiKhoan: true,
        tenTaiKhoan: true,
        hoVaTen: true,
        ngaySinh: true,
        gioiTinh: true,
        soDienThoai: true,
        email: true,
        diaChi: true,
        BenhNhan: {
          include: {
            HoSoBenhAn: {
              include: {
                // 1. Lấy thông tin Bác sĩ (Đã có)
                BacSi: {
                  include: {
                    TaiKhoan: {
                      select: { hoVaTen: true }
                    }
                  }
                },
                PhanCong: {
                  where: { ngayKetThuc: null },
                  include: {
                    KyThuatVien: {
                      include: {
                        TaiKhoan: {
                          select: { hoVaTen: true }
                        }
                      }
                    }
                  }
                }
              },
              orderBy: { ngayLapHoSo: "desc" }
            }
          }
        }
      }
    });
  }
};

export class UserService {
  // Cập nhật thông tin Bệnh nhân
  static async updatePatientProfile(userId: number, data: any) {
    const {
      ngaySinh, gioiTinh, soDienThoai, diaChi, // Thông tin chung (bảng TaiKhoan)
      chieuCao, canNang, tienSuChanThuong, tinhTrangHienTai // Thông tin y tế (bảng BenhNhan)
    } = data;

    return prisma.$transaction(async (tx) => {
      // 1. Update bảng TaiKhoan
      await tx.taiKhoan.update({
        where: { maTaiKhoan: userId },
        data: {
          ngaySinh: ngaySinh ? new Date(ngaySinh) : undefined,
          gioiTinh: gioiTinh,
          soDienThoai,
          diaChi
        }
      });

      // 2. Update bảng BenhNhan
      // Tìm xem đã có record BenhNhan chưa?
      const benhNhan = await tx.benhNhan.findFirst({
        where: { maTaiKhoan: userId }
      });

      if (benhNhan) {
        await tx.benhNhan.update({
          where: { maBenhNhan: benhNhan.maBenhNhan },
          data: {
            chieuCao: chieuCao ? parseFloat(chieuCao) : undefined,
            canNang: canNang ? parseFloat(canNang) : undefined,
            tienSuChanThuong,
            tinhTrangHienTai
          }
        });
      } else {
        // Nếu chưa có => tạo mới
        await tx.benhNhan.create({
          data: {
            maTaiKhoan: userId,
            chieuCao: chieuCao ? parseFloat(chieuCao) : null,
            canNang: canNang ? parseFloat(canNang) : null,
            tienSuChanThuong,
            tinhTrangHienTai
          }
        });
      }

      return { message: "Cập nhật hồ sơ thành công" };
    });
  }

  static async getPatientProfile(userId: number) {
    return prisma.benhNhan.findFirst({
      where: { maTaiKhoan: userId },
      select: {
        chieuCao: true,
        canNang: true,
        tienSuChanThuong: true,
        tinhTrangHienTai: true,
      }
    });
  }
}
