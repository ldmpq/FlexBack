import { useState, useEffect, useCallback } from 'react';
import { reportService } from '../services/report.service';
import { ReportHistory } from '../types/result.type';

export const useResult = () => {
  const [reports, setReports] = useState<ReportHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReports = useCallback(async () => {
    try {
      const data = await reportService.getMyReports();
      setReports(data);
    } catch (error) {
      console.error("Lỗi lấy lịch sử:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchReports();
  };

  // Tính thống kê (đơn giản)
  const stats = {
    totalSessions: reports.length,
    totalDuration: reports.reduce((sum, item) => sum + (item.thoiLuong || 0), 0),
    avgPain: reports.length > 0 
      ? (reports.reduce((sum, item) => sum + (item.mucDoDau || 0), 0) / reports.length).toFixed(1) 
      : 0
  };

  return {
    reports,
    loading,
    refreshing,
    onRefresh,
    stats
  };
};