import { ThuocModel, CreateThuocDTO } from '../models/thuocModel';

export const ThuocService = {
  getAllThuoc: async () => {
    return await ThuocModel.findAll();
  },

  createThuoc: async (data: CreateThuocDTO) => {
    if (!data.tenThuoc) {
      throw new Error("Tên thuốc là bắt buộc!");
    }
    return await ThuocModel.create(data);
  },

  updateThuoc: async (id: number, data: Partial<CreateThuocDTO>) => {
    return await ThuocModel.update(id, data);
  },

  deleteThuoc: async (id: number) => {
    return await ThuocModel.delete(id);
  }
};