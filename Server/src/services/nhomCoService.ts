import { NhomCoModel, CreateNhomCoDTO } from '../models/nhomCoModel';

export const NhomCoService = {
  getAllNhomCo: async () => {
    return await NhomCoModel.findAll();
  },

  createNhomCo: async (data: CreateNhomCoDTO) => {
    if (!data.tenNhomCo) {
      throw new Error("Tên nhóm cơ là bắt buộc!");
    }
    return await NhomCoModel.create(data);
  },

  updateNhomCo: async (id: number, data: Partial<CreateNhomCoDTO>) => {
    // Kiểm tra tồn tại
    const existing = await NhomCoModel.findById(id);
    if (!existing) throw new Error("Nhóm cơ không tồn tại!");

    return await NhomCoModel.update(id, data);
  },

  deleteNhomCo: async (id: number) => {
    // Kiểm tra tồn tại
    const existing = await NhomCoModel.findById(id);
    if (!existing) throw new Error("Nhóm cơ không tồn tại!");

    try {
      return await NhomCoModel.delete(id);
    } catch (error) {
      throw new Error("Không thể xóa nhóm cơ này vì đang có bài tập liên quan.");
    }
  }
};