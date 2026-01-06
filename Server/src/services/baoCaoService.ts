import prisma from '../prismaClient';
import { CreateBaoCaoDTO } from '../models/baoCaoModel';

export class BaoCaoService {

  static async createBaoCao(data: CreateBaoCaoDTO) {
    const { maKeHoach, thoiLuong, mucDoDau, danhGiaSoBo, ngayLuyenTap } = data;

    // 1. Kiểm tra kế hoạch tồn tại
    const keHoach = await prisma.keHoachDieuTri.findUnique({
      where: { maKeHoach: parseInt(maKeHoach) }
    });

    if (!keHoach) {
      throw new Error('Kế hoạch điều trị không tồn tại!');
    }

    // 2. Lưu báo cáo
    const newBaoCao = await prisma.baoCaoLuyenTap.create({
      data: {
        maKeHoach: parseInt(maKeHoach),
        thoiLuong: parseInt(thoiLuong),
        mucDoDau: parseInt(mucDoDau),
        danhGiaSoBo,
        ngayLuyenTap: ngayLuyenTap ? new Date(ngayLuyenTap) : new Date()
      }
    });

    return newBaoCao;
  }

  static async getReportsByPatient(userId: number) {
    // 1. Tìm mã bệnh nhân từ userId
    const benhNhan = await prisma.benhNhan.findFirst({
      where: { maTaiKhoan: userId }
    });

    if (!benhNhan) return [];

    // 2. Lấy tất cả báo cáo liên quan đến bệnh nhân
    // Logic: BaoCao -> KeHoach -> LoTrinh -> MucTieu -> HoSo -> BenhNhan
    // Truy vấn ngược từ BaoCaoLuyenTap
    const reports = await prisma.baoCaoLuyenTap.findMany({
      where: {
        KeHoachDieuTri: {
          LoTrinhDieuTri: {
            MucTieuDieuTri: {
              HoSoBenhAn: {
                maBenhNhan: benhNhan.maBenhNhan
              }
            }
          }
        }
      },
      include: {
        KeHoachDieuTri: {
          select: {
            tenKeHoach: true,
            LoTrinhDieuTri: {
              select: { tenLoTrinh: true }
            }
          }
        }
      },
      orderBy: { ngayLuyenTap: 'desc' } // Mới nhất lên đầu
    });

    return reports;
  }

  // [Admin] Lấy danh sách tất cả báo cáo (kèm tên bệnh nhân)
  static async getAllReports() {
    const data = await prisma.baoCaoLuyenTap.findMany({
      orderBy: { ngayLuyenTap: 'desc' },
      include: {
        KeHoachDieuTri: {
          include: { // Dùng include để lấy hết thông tin kế hoạch
            LoTrinhDieuTri: {
              include: { // Lấy hết thông tin lộ trình
                MucTieuDieuTri: {
                  include: { // Quan trọng: Phải đi qua Mục tiêu mới tới Hồ sơ
                    HoSoBenhAn: {
                      include: {
                        BenhNhan: {
                          include: {
                            TaiKhoan: {
                              select: { hoVaTen: true } // Chỉ lấy tên ở đích đến cuối cùng
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
    
    return data;
}

  // [Admin] Lấy chi tiết 1 báo cáo
  static async getReportDetail(id: number) {
    return await prisma.baoCaoLuyenTap.findUnique({
      where: { maBaoCao: id },
      include: {
        KeHoachDieuTri: {
          include: {
            ChiTietKeHoach: {
              include: {
                BaiTapPhucHoi: {
                  select: { tenBaiTap: true }
                }
              }
            },
            LoTrinhDieuTri: {
              include: {
                MucTieuDieuTri: {
                  include: {
                    HoSoBenhAn: {
                      include: {
                        BenhNhan: {
                          include: {
                            TaiKhoan: { select: { hoVaTen: true } }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  // [Admin] Gửi phản hồi (Tạo đánh giá tiến triển)
  static async createFeedback(maHoSo: number, chiTiet: string, thangDiem?: any) {
    return await prisma.danhGiaTienTrien.create({
      data: {
        maHoSo: maHoSo,
        chiTiet: chiTiet,
        ngayDanhGia: new Date(),
        daDoc: false,
        thangDiem: thangDiem ? parseFloat(thangDiem) : null
      }
    });
  }

  static async getFeedbackByPatient(userId: number) {
    const benhNhan = await prisma.benhNhan.findFirst({
      where: { maTaiKhoan: userId }
    });
    if (!benhNhan) return [];

    const dsHoSo = await prisma.hoSoBenhAn.findMany({
      where: { maBenhNhan: benhNhan.maBenhNhan },
      select: { maHoSo: true }
    });
    
    const listMaHoSo = dsHoSo.map(h => h.maHoSo);

    const feedbacks = await prisma.danhGiaTienTrien.findMany({
      where: { 
        maHoSo: { in: listMaHoSo } 
      },
      orderBy: { ngayDanhGia: 'desc' },
      select: {
        maDanhGia: true,
        chiTiet: true,
        ngayDanhGia: true,
        thangDiem: true,
        daDoc: true
      }
    });

    return feedbacks;
  }
}