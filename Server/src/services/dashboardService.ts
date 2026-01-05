import prisma from '../prismaClient';

export class DashboardService {

  // 1. Lấy 3 chỉ số thống kê đầu trang
  static async getSummaryStats() {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    try {
      // Đếm hồ sơ "Đang điều trị"
      const treatingCount = await prisma.hoSoBenhAn.count({
        where: { 
          trangThaiHienTai: 'Đang điều trị' 
        }
      });

      // Đếm tổng bài tập
      const exerciseCount = await prisma.baiTapPhucHoi.count();

      // Đếm báo cáo hôm nay
      const newReportsCount = await prisma.baoCaoLuyenTap.count({
        where: {
          ngayLuyenTap: {
            gte: startOfToday,
            lte: endOfToday
          }
        }
      });

      return { treatingCount, exerciseCount, newReportsCount };

    } catch (error) {
      console.error("Lỗi service dashboard:", error);
      // Trả về 0 để không làm crash app nếu lỗi DB
      return { treatingCount: 0, exerciseCount: 0, newReportsCount: 0 };
    }
  }

  // 2. Dữ liệu biểu đồ tròn (Phân bố trạng thái)
  static async getStatusDistribution() {
    const stats = await prisma.hoSoBenhAn.groupBy({
      by: ['trangThaiHienTai'],
      _count: { maHoSo: true }
    });

    // Chuyển đổi dữ liệu cho Recharts
    return stats.map(item => ({
      name: item.trangThaiHienTai || 'Chưa xác định',
      value: item._count.maHoSo
    }));
  }

  // 3. Dữ liệu biểu đồ cột (Báo cáo 7 ngày qua)
  static async getWeeklyActivity() {
    const result = [];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      
      const start = new Date(d.setHours(0,0,0,0));
      const end = new Date(d.setHours(23,59,59,999));

      const count = await prisma.baoCaoLuyenTap.count({
        where: {
          ngayLuyenTap: {
            gte: start,
            lte: end
          }
        }
      });

      result.push({
        name: `${start.getDate()}/${start.getMonth() + 1}`,
        reports: count
      });
    }
    return result;
  }
}