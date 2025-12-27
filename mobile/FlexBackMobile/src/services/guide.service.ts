import axiosClient from '../utils/axiosClient';

export const guideService = {
  getExercises: async () => {
    const res = await axiosClient.get('/exercises/list');
    return res.data.data;
  },
  
  getMedicines: async () => {
    // Gọi route thuocRoute
    const res = await axiosClient.get('/thuoc'); 
    // Mapper dữ liệu cho khớp với GuideItem interface
    return res.data.data.map((item: any) => ({
      id: item.maThuoc,
      name: item.tenThuoc,
      description: item.congDung,
      category: 'MEDICINE'
    }));
  },

  getFoods: async () => {
    // Gọi route thucPhamRoute
    const res = await axiosClient.get('/thucpham');
    return res.data.data.map((item: any) => ({
      id: item.maThucPham,
      name: item.tenThucPham,
      description: item.chiTiet,
      category: 'FOOD'
    }));
  }
};