import { Request, Response } from 'express';
import prisma from '../prismaClient';

// Lấy danh sách PHẢN HỒI (Đánh giá tiến triển) của User
export const getMyNotifications = async (req: Request | any, res: Response) => {
  try {
    const userId = req.user?.id;

    const list = await prisma.danhGiaTienTrien.findMany({
      where: {
        // Tìm các đánh giá thuộc về Hồ sơ của Bệnh nhân có userId này
        HoSoBenhAn: {
          BenhNhan: {
            maTaiKhoan: userId
          }
        }
      },
      orderBy: {
        ngayDanhGia: 'desc'
      },
      include: {
        HoSoBenhAn: {
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

    const data = list.map(item => ({
      maThongBao: item.maDanhGia,
      tieuDe: "Phản hồi tiến triển",
      noiDung: item.chiTiet || "Bác sĩ đã đánh giá quá trình tập luyện của bạn.",
      ngayTao: item.ngayDanhGia,
      thangDiem: item.thangDiem,
      daDoc: item.daDoc,
      BacSi: {
        hoVaTen: item.HoSoBenhAn?.BacSi?.TaiKhoan?.hoVaTen || "Bác sĩ phụ trách"
      }
    }));

    res.status(200).json({ data });
  } catch (error) {
    console.error("Lỗi lấy phản hồi:", error);
    res.status(500).json({ message: "Lỗi Server" });
  }
};

export const getUnreadCount = async (req: Request | any, res: Response) => {
    res.status(200).json({ count: 0 });
};

export const markAsRead = async (req: Request | any, res: Response) => {
    try {
        const userId = req.user?.id;

        await prisma.danhGiaTienTrien.updateMany({
            where: {
                HoSoBenhAn: { BenhNhan: { maTaiKhoan: userId } },
                daDoc: false
            },
            data: { daDoc: true }
        });
        
        res.status(200).json({ message: "Đã đánh dấu đã đọc" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi update" });
    }
};