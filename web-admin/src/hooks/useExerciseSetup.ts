import { useState, useEffect } from 'react';
import { exerciseService } from '../services/exercise.service';
import type { BaiTapConfig, LoTrinh } from '../types/treatment.type';
import type { Exercise } from '../types/exercise.type';

export const useExerciseSetup = (loTrinh: LoTrinh, onSaveSuccess: () => void) => {

  const [allExercises, setAllExercises] = useState<Exercise[]>([]); 
  const [selectedExercises, setSelectedExercises] = useState<Record<number, BaiTapConfig>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);

        const exercises = await exerciseService.getExercises();
        setAllExercises(exercises);

        if (loTrinh.ChiTietBaiTap && loTrinh.ChiTietBaiTap.length > 0) {
          const initialSelected: Record<number, BaiTapConfig> = {};
          loTrinh.ChiTietBaiTap.forEach(bt => {
            initialSelected[bt.maBaiTap] = bt;
          });
          setSelectedExercises(initialSelected);
        }
      } catch (error) {
        console.error("Lỗi tải bài tập:", error);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [loTrinh]);

  // Hàm chọn/bỏ chọn (Chuyển đổi từ Exercise sang BaiTapConfig)
  const toggleExercise = (exercise: Exercise) => {
    setSelectedExercises(prev => {
      const next = { ...prev };
      if (next[exercise.maBaiTap]) {
        delete next[exercise.maBaiTap];
      } else {
        // Khởi tạo cấu hình mặc định
        next[exercise.maBaiTap] = {
          maBaiTap: exercise.maBaiTap,
          tenBaiTap: exercise.tenBaiTap,
          doKho: exercise.mucDo,
          dungCuCanThiet: exercise.dungCuCanThiet,
          maNhomCo: exercise.maNhomCo,
          soSet: 3, 
          soRep: 10, 
          thoiLuongPhut: 0, 
          ghiChu: ''
        };
      }
      return next;
    });
  };

  const updateConfig = (id: number, field: keyof BaiTapConfig, value: any) => {
    setSelectedExercises(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const saveConfiguration = async () => {
    try {
      setIsSaving(true);
      const { treatmentService } = await import('../services/treatment.service');
      
      const payload = Object.values(selectedExercises);
      await treatmentService.saveRouteExercises(loTrinh.maLoTrinh, payload);
      
      alert("Đã lưu cấu hình bài tập thành công!");
      onSaveSuccess();
    } catch (error) {
      alert("Lỗi khi lưu bài tập.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    allExercises,
    selectedExercises,
    loading,
    isSaving,
    toggleExercise,
    updateConfig,
    saveConfiguration
  };
};