import prisma from '../prismaClient';

export class BenhNhanService {
  static async getAssignedPatients(userId: number) {
    // 1. Tìm thông tin Kỹ thuật viên
    const kyThuatVien = await prisma.kyThuatVien.findFirst({
      where: { maTaiKhoan: userId }
    });

    if (!kyThuatVien) {
      console.log("Không tìm thấy Kỹ thuật viên với UserID:", userId);
      return [];
    }

    console.log("Kỹ thuật viên ID:", kyThuatVien.maKyThuatVien);

    // 2. Truy vấn Bệnh nhân
    try {
      const patients = await prisma.benhNhan.findMany({
        where: {
          HoSoBenhAn: { 
            some: {
              PhanCong: { 
                some: {
                  maKyThuatVien: kyThuatVien.maKyThuatVien
                }
              }
            }
          }
        },
        include: {
          TaiKhoan: {
            select: {
              hoVaTen: true,
              soDienThoai: true,
              diaChi: true,
              gioiTinh: true,
              ngaySinh: true
            }
          },
          HoSoBenhAn: {
            // Chỉ lấy hồ sơ nào ĐƯỢC PHÂN CÔNG cho KTV này
            where: {
              PhanCong: {
                some: { maKyThuatVien: kyThuatVien.maKyThuatVien }
              }
            },
            take: 1, // Lấy hồ sơ mới nhất
            orderBy: { ngayLapHoSo: 'desc' },
            select: {
              maHoSo: true,
              chanDoan: true,
              trangThaiHienTai: true,
              ngayLapHoSo: true
            }
          }
        }
      });
      
      console.log("Tìm thấy:", patients.length, "bệnh nhân.");
      return patients;

    } catch (error) {
      console.error("LỖI PRISMA:", error);
      throw error;
    }
  }

  static async getPatientDetail(id: number) {
    return await prisma.benhNhan.findUnique({
      where: { maBenhNhan: id },
      include: {
        TaiKhoan: {
          select: {
            hoVaTen: true,
            soDienThoai: true,
            email: true,
            diaChi: true,
            ngaySinh: true,
            gioiTinh: true
          }
        },
        HoSoBenhAn: {
          orderBy: { ngayLapHoSo: 'desc' },
          include: {
            BacSi: {
              include: {
                TaiKhoan: { select: { hoVaTen: true } }
              }
            }
          }
        }
      }
    });
  }
}