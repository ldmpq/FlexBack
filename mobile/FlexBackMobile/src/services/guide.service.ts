import axiosClient from '../utils/axiosClient';

export const guideService = {
  getExercises: async () => {
    const response = await axiosClient.get('/exercises'); 
    const list = response.data?.data || response.data || []; 
    return list.map((e: any) => ({
      id: e.maBaiTap,
      name: e.tenBaiTap,
      description: e.moTa, 
      category: 'EXERCISE',
      mucDo: e.mucDo,
      dungCu: e.dungCu,
      videoUrl: e.videoUrl,
      ...e 
    }));
  },
  
  getMedicines: async () => {
    const response = await axiosClient.get('/thuoc');
    const list = response.data?.data || response.data || [];
    return list.map((item: any) => ({
      id: item.maThuoc,
      name: item.tenThuoc,
      description: item.congDung,
      category: 'MEDICINE'
    }));
  },

  getFoods: async () => {
    const response = await axiosClient.get('/thuoc');
    const list = response.data?.data || response.data || [];
    return list.map((item: any) => ({
      id: item.maThucPham,
      name: item.tenThucPham,
      description: item.chiTiet,
      category: 'FOOD'
    }));
  }
};