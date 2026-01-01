import prisma from "../prismaClient";

export const TreatmentModel = {
  // 1. Lấy chi tiết cây điều trị
  getTreatmentTree(maHoSo: number) {
    return prisma.hoSoBenhAn.findUnique({
      where: { maHoSo },
      include: {
        BenhNhan: {
          include: {
            TaiKhoan: { select: { hoVaTen: true } }
          }
        },
        BacSi: {
            include: {
                TaiKhoan: { select: { hoVaTen: true } }
            }
        },
        PhanCong: {
            where: { ngayKetThuc: null },
            include: {
                KyThuatVien: {
                    include: {
                        TaiKhoan: { select: { hoVaTen: true } }
                    }
                }
            }
        },
        MucTieuDieuTri: {
          include: {
            LoTrinhDieuTri: {
              include: {
                KyThuatVien: {
                  include: {
                    TaiKhoan: { select: { hoVaTen: true } }
                  }
                },
                // Lấy danh sách Kế hoạch điều trị -> Chi tiết -> Bài tập
                KeHoachDieuTri: {
                  include: {
                    ChiTietKeHoach: {
                      include: {
                        BaiTapPhucHoi: true 
                      }
                    }
                  }
                }
              },
              orderBy: { thoiGianBatDau: "asc" }
            }
          },
          orderBy: { ngayDatMucTieu: "desc" }
        }
      }
    });
  },

  createMucTieu(data: any) {
    return prisma.mucTieuDieuTri.create({
      data: {
        noiDung: data.noiDung,
        mucDoUuTien: data.mucDoUuTien,
        trangThai: data.trangThai,
        ngayDatMucTieu: new Date(data.ngayDatMucTieu),

        // Quan trọng: mapping quan hệ với HoSoBenhAn
        HoSoBenhAn: data.maHoSo
          ? { connect: { maHoSo: data.maHoSo } }
          : undefined,
      }
    });
  },

  async createLoTrinh(data: any) {
    // Tạo Lộ trình
    const loTrinh = await prisma.loTrinhDieuTri.create({
      data: {
        maMucTieu: data.maMucTieu,
        tenLoTrinh: data.tenLoTrinh,
        thoiGianBatDau: data.thoiGianBatDau,
        thoiGianKetThuc: data.thoiGianKetThuc,
        ghiChu: data.ghiChu,
        maKyThuatVien: data.maKyThuatVien
      }
    });

    // Tạo Kế hoạch mặc định
    await prisma.keHoachDieuTri.create({
      data: {
        maLoTrinh: loTrinh.maLoTrinh,
        tenKeHoach: "Kế hoạch điều trị",
        thoiGianBatDau: data.thoiGianBatDau,
        thoiGianKetThuc: data.thoiGianKetThuc,
        moTa: "Tự động tạo khi thêm lộ trình"
      }
    });

    return loTrinh;
  },

  getAllExercises() {
    return prisma.baiTapPhucHoi.findMany({
      include: { NhomCo: true }
    });
  },

  getTechnicians() {
    return prisma.kyThuatVien.findMany({
      include: {
        TaiKhoan: { select: { hoVaTen: true } }
      }
    });
  },

  async deleteMucTieu(maMucTieu: number) {
    return await prisma.mucTieuDieuTri.delete({
      where: { 
        maMucTieu: maMucTieu 
      }
    });
  },

  async deleteLoTrinh(maLoTrinh: number) {
    return await prisma.$transaction(async (tx) => {
      // 1. Tìm danh sách các Kế hoạch thuộc Lộ trình này
      const keHoachList = await tx.keHoachDieuTri.findMany({
        where: { maLoTrinh: maLoTrinh },
        select: { maKeHoach: true } // Chỉ cần lấy ID
      });

      const keHoachIds = keHoachList.map(k => k.maKeHoach);

      if (keHoachIds.length > 0) {
        // 2. QUAN TRỌNG: Xóa "Chi tiết kế hoạch" (Bài tập đã gán) trước!
        // Đây là bước bạn đang thiếu gây ra lỗi 500
        await tx.chiTietKeHoach.deleteMany({
          where: { maKeHoach: { in: keHoachIds } }
        });

        // 3. Sau đó mới được xóa "Kế hoạch điều trị"
        await tx.keHoachDieuTri.deleteMany({
          where: { maLoTrinh: maLoTrinh }
        });
      }

      // 4. Cuối cùng xóa "Lộ trình"
      return await tx.loTrinhDieuTri.delete({
        where: { maLoTrinh: maLoTrinh }
      });
    });
  },

  async saveRouteExercises(maLoTrinh: number, exercisesData: any[]) {
    return prisma.$transaction(async (tx) => {
      // 1. Tìm kế hoạch của lộ trình
      let keHoach = await tx.keHoachDieuTri.findFirst({
        where: { maLoTrinh },
        orderBy: { maKeHoach: 'desc' }
      });

      if (!keHoach) {
        keHoach = await tx.keHoachDieuTri.create({
          data: {
            maLoTrinh,
            tenKeHoach: "Kế hoạch bổ sung",
            thoiGianBatDau: new Date(),
            thoiGianKetThuc: new Date()
          }
        });
      }

      const maKeHoach = keHoach.maKeHoach;

      // 2. Xóa chi tiết cũ
      await tx.chiTietKeHoach.deleteMany({ where: { maKeHoach } });

      // 3. Thêm chi tiết mới
      if (exercisesData.length > 0) {
        await tx.chiTietKeHoach.createMany({
          data: exercisesData.map((ex) => ({
            maKeHoach,
            maBaiTap: ex.maBaiTap,
            sets: ex.soSet,
            reps: ex.soRep,
            cuongDo: ex.thoiLuongPhut ? `${ex.thoiLuongPhut}` : "0", 
            ghiChu: ex.ghiChu
          }))
        });
      }
    });
  }
};