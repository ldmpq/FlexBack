import { useState, useEffect, useCallback } from 'react';
import { programService } from '../services/program.service';
import { ProgramData } from '../types/program.type';

export const useProgram = () => {
  const [program, setProgram] = useState<ProgramData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProgram = useCallback(async () => {
    try {
      // Gọi service lấy dữ liệu lộ trình
      const data = await programService.getMyProgram();
      setProgram(data);
    } catch (error) {
      console.error("Lỗi tải lộ trình:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Tải dữ liệu khi hook được khởi tạo
  useEffect(() => {
    fetchProgram();
  }, [fetchProgram]);

  // Hàm làm mới dữ liệu (kéo xuống để reload)
  const onRefresh = () => {
    setRefreshing(true);
    fetchProgram();
  };

  return {
    program,
    loading,
    refreshing,
    onRefresh
  };
};