import prisma from '../prismaClient';

export class BenhNhanService {
  // 1. Lấy danh sách bệnh nhân mà KTV đang phụ trách (Active)
  static async getAssignedPatients(userId: number) {
    const kyThuatVien = await prisma.kyThuatVien.findFirst({
      where: { maTaiKhoan: userId }
    });
    if (!kyThuatVien) return [];
    return await prisma.benhNhan.findMany({
      where: {
        HoSoBenhAn: { 
          some: {
            PhanCong: { 
              some: {
                maKyThuatVien: kyThuatVien.maKyThuatVien,
                ngayKetThuc: null
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
          where: {
            PhanCong: {
              some: { 
                maKyThuatVien: kyThuatVien.maKyThuatVien,
                ngayKetThuc: null 
              }
            }
          },
          take: 1,
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
  }

  static async getPatientDetail(id: number) {
    return await prisma.benhNhan.findUnique({
      where: { maBenhNhan: id },
      include: {
        TaiKhoan: true,
        HoSoBenhAn: {
          orderBy: { ngayLapHoSo: 'desc' },
          include: {
            BacSi: {
              include: { TaiKhoan: { select: { hoVaTen: true } } }
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
            }
          }
        }
      }
    });
  }
}