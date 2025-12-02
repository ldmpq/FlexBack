import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// [GET] /api/users/benh-nhan
export const getAllBenhNhan = async (req: Request, res: Response): Promise<void> => {
  try {
    const benhNhans = await prisma.taiKhoan.findMany({
      where: {
        loaiTaiKhoan: 'BENH_NHAN'
      },
      select: {
        maTaiKhoan: true,
        tenTaiKhoan: true,
        hoVaTen: true,
        email: true,
        soDienThoai: true,
        gioiTinh: true,
        ngaySinh: true,
        BenhNhan: { 
          // --- CẬP NHẬT QUAN TRỌNG: Lấy thêm danh sách Hồ sơ ---
          include: {
            HoSoBenhAn: { // Hoặc hoSoBenhAn tùy tên trong Prisma Client của bạn
               select: {
                 maHoSo: true,
                 ngayLapHoSo: true,
                 chanDoan: true,
                 trangThaiHienTai: true
               },
               orderBy: { ngayLapHoSo: 'desc' }
            }
          }
        }
      }
    });

    res.status(200).json({
      message: 'Lấy danh sách bệnh nhân thành công!',
      data: benhNhans
    });

  } catch (error) {
    console.error("Lỗi getAllBenhNhan:", error);
    res.status(500).json({ message: 'Lỗi hệ thống', error });
  }
};

// [GET] /api/users/benh-nhan/:id
export const getBenhNhanById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const benhNhan = await prisma.taiKhoan.findUnique({
      where: { maTaiKhoan: parseInt(id) },
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
            HoSoBenhAn: { // Đảm bảo dùng đúng tên relation (thường là HOSOSO_BENHAN hoặc hoSoBenhAn)
              include: {
                // Lấy thông tin Bác sĩ phụ trách
                BacSi: { 
                    include: { 
                        TaiKhoan: {
                            select: { hoVaTen: true }
                        }
                    } 
                } 
              },
              orderBy: { ngayLapHoSo: 'desc' } 
            }
          }
        }
      }
    });

    if (!benhNhan) {
      res.status(404).json({ message: 'Không tìm thấy bệnh nhân' });
      return;
    }

    res.status(200).json({
      message: 'Lấy thông tin chi tiết thành công!',
      data: benhNhan
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi hệ thống!', error });
  }
};