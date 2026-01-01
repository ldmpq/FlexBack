import { useState, useEffect } from 'react';
import { treatmentService } from '../services/treatment.service';
import type { HoSo, KTVOption } from '../types/treatment.type';

export const useTreatmentManager = () => {
  const [listHoSo, setListHoSo] = useState<HoSo[]>([]);
  const [selectedHoSo, setSelectedHoSo] = useState<HoSo | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedMucTieu, setExpandedMucTieu] = useState<number | null>(null);
  const [listKTV, setListKTV] = useState<KTVOption[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Initial Load
  useEffect(() => {
    const fetchList = async () => {
      try {
        setLoading(true);
        const data = await treatmentService.getPatients();
        setListHoSo(data);
      } catch (error) {
        console.error("Lỗi tải danh sách:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, []);

  const handleSelectHoSo = async (maHoSo: number) => {
    try {
      const currentItem = listHoSo.find(h => h.maHoSo === maHoSo);
      const data = await treatmentService.getTreatmentDetail(maHoSo);
      
      setSelectedHoSo({
        ...data,
        BenhNhan: currentItem?.BenhNhan,
        tenBenhNhan: currentItem?.tenBenhNhan
      });
      setExpandedMucTieu(null);
    } catch (error) {
      console.error("Lỗi xem chi tiết:", error);
      alert("Không thể tải chi tiết hồ sơ này.");
    }
  };

  const fetchKTV = async () => {
    try {
      const data = await treatmentService.getTechnicians();
      setListKTV(data);
    } catch (error) { console.error(error); }
  };

  const createGoal = async (goalData: any) => {
    if (!selectedHoSo) return;
    try {
      setSubmitting(true);
      await treatmentService.createGoal({ maHoSo: selectedHoSo.maHoSo, ...goalData });
      alert("Thêm mục tiêu thành công!");
      await handleSelectHoSo(selectedHoSo.maHoSo); // Reload detail
      return true;
    } catch (error) {
      alert("Lỗi khi thêm mục tiêu.");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteGoal = async (maMucTieu: number) => {
    if (!selectedHoSo) return false;
    try {
      setSubmitting(true);
      await treatmentService.deleteGoal(maMucTieu); // Gọi API xóa mục tiêu
      
      alert("Xóa mục tiêu thành công!");
      await handleSelectHoSo(selectedHoSo.maHoSo); // Reload data
      return true;
    } catch (error) {
      console.error("Lỗi xóa mục tiêu:", error);
      alert("Lỗi khi xóa mục tiêu. Vui lòng thử lại.");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const createRoute = async (routeData: any, targetMucTieuId: number) => {
    try {
      setSubmitting(true);
      await treatmentService.createRoute({ maMucTieu: targetMucTieuId, ...routeData });
      alert("Thêm lộ trình thành công!");
      if (selectedHoSo) await handleSelectHoSo(selectedHoSo.maHoSo);
      setExpandedMucTieu(targetMucTieuId);
      return true;
    } catch (error) {
      alert("Lỗi khi thêm lộ trình.");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteRoute = async (maLoTrinh: number) => {
    if (!selectedHoSo) return false;
    try {
      setSubmitting(true);
      await treatmentService.deleteRoute(maLoTrinh);
      
      alert("Xóa lộ trình thành công!");
      await handleSelectHoSo(selectedHoSo.maHoSo); // Tải lại dữ liệu
      return true;
    } catch (error) {
      console.error("Lỗi xóa lộ trình:", error);
      alert("Lỗi khi xóa lộ trình. Vui lòng thử lại.");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    listHoSo,
    selectedHoSo,
    loading,
    expandedMucTieu,
    listKTV,
    submitting,
    setExpandedMucTieu,
    handleSelectHoSo,
    fetchKTV,
    createGoal,
    deleteGoal,
    createRoute, 
    deleteRoute
  };
};