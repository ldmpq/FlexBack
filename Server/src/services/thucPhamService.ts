import { ThucPhamModel, CreateThucPhamDTO } from '../models/thucPhamModel';

export const ThucPhamService = {
  getAllThucPham: async () => {
    return await ThucPhamModel.findAll();
  },

  createThucPham: async (data: CreateThucPhamDTO) => {
    if (!data.tenThucPham) {
      throw new Error("Tên thực phẩm là bắt buộc!");
    }
    return await ThucPhamModel.create(data);
  },

  updateThucPham: async (id: number, data: Partial<CreateThucPhamDTO>) => {
    return await ThucPhamModel.update(id, data);
  },

  deleteThucPham: async (id: number) => {
    return await ThucPhamModel.delete(id);
  }
};