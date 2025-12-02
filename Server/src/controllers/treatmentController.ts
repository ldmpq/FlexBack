import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. Lấy chi tiết cây lộ trình của một Hồ sơ
// GET /api/treatment/:maHoSo
export const getTreatmentTree = async (req: Request, res: Response): Promise<void> => {
  try {
    const { maHoSo } = req.params;

    const treatmentData = await prisma.hoSoBenhAn.findUnique({
      where: { maHoSo: parseInt(maHoSo) },
      include: {
        BenhNhan: {
          include: {
            TaiKhoan: { select: { hoVaTen: true } }
          }
        },
        MucTieuDieuTri: {
          include: {
            LoTrinhDieuTri: {
              include: {
                KeHoachDieuTri: true, // Lấy sơ bộ kế hoạch
                KyThuatVien: {
                    include: {
                        TaiKhoan: { select: { hoVaTen: true } } // Lấy tên KTV
                    }
                }
              },
              orderBy: { thoiGianBatDau: 'asc' }
            }
          },
          orderBy: { ngayDatMucTieu: 'desc' }
        }
      }
    });

    if (!treatmentData) {
      res.status(404).json({ message: 'Không tìm thấy hồ sơ' });
      return;
    }

    res.status(200).json({ data: treatmentData });
  } catch (error) {
    console.error("Lỗi lấy dữ liệu lộ trình:", error);
    res.status(500).json({ message: 'Lỗi hệ thống' });
  }
};

// 2. Thêm Mục tiêu điều trị
// POST /api/treatment/muctieu
export const createMucTieu = async (req: Request, res: Response): Promise<void> => {
  try {
    // Lấy mucDoUuTien từ request body
    const { maHoSo, noiDung, trangThai, ngayDatMucTieu } = req.body;
    
    const newItem = await prisma.mucTieuDieuTri.create({
      data: {
        maHoSo: parseInt(maHoSo),
        noiDung,
        trangThai:'Chưa hoàn thành', // Dùng trường mới
        ngayDatMucTieu: new Date(ngayDatMucTieu)
      }
    });
    res.status(201).json({ message: 'Thêm mục tiêu thành công', data: newItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi thêm mục tiêu' });
  }
};

// 3. Thêm Lộ trình điều trị
// POST /api/treatment/lotrinh
export const createLoTrinh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { maMucTieu, tenLoTrinh, thoiGianBatDau, thoiGianKetThuc, ghiChu, maKyThuatVien } = req.body; // Thêm maKyThuatVien
    
    // Thêm logic chuyển maKyThuatVien từ string/null sang number/null
    const ktvId = maKyThuatVien ? parseInt(maKyThuatVien) : null;
    
    const newItem = await prisma.loTrinhDieuTri.create({
      data: {
        maMucTieu: parseInt(maMucTieu),
        tenLoTrinh,
        thoiGianBatDau: new Date(thoiGianBatDau),
        thoiGianKetThuc: new Date(thoiGianKetThuc),
        ghiChu,
        maKyThuatVien: ktvId // Lưu KTV
      }
    });
    res.status(201).json({ message: 'Thêm lộ trình thành công', data: newItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi thêm lộ trình' });
  }
};