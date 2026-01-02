import { useState } from 'react';
import { BicepsFlexed, Edit, Trash2, Plus, Inbox } from 'lucide-react';
import { useMuscle } from '../hooks/useMuscleManager'; 
import type { NhomCo, CreateNhomCoDTO } from '../types/muscle.type';
import SearchBar from '../components/SearchBar'; 
import MuscleFormModal from '../components/forms/MuscleForm';

const MusclePage = () => {
  const { data, loading, create, update, remove } = useMuscle();
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // State quản lý Modal
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<NhomCo | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Mở Modal Thêm mới
  const handleOpenCreate = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  // Mở Modal Sửa
  const handleOpenEdit = (item: NhomCo) => {
    setEditingItem(item);
    setShowModal(true);
  };

  // Xử lý Xóa
  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa nhóm cơ "${name}"?`)) return;
    try {
      await remove(id);
      alert("Đã xóa thành công!");
    } catch (error) {
      alert("Không thể xóa (có thể đang có bài tập liên quan).");
    }
  };

  // Xử lý Lưu (Được gọi từ Component con)
  const handleSave = async (formData: CreateNhomCoDTO) => {
    try {
      setSubmitting(true);
      if (editingItem && editingItem.maNhomCo) {
        // Logic Sửa
        await update(editingItem.maNhomCo, formData);
        alert("Cập nhật thành công!");
      } else {
        // Logic Thêm
        await create(formData);
        alert("Tạo mới thành công!");
      }
      setShowModal(false);
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi lưu dữ liệu.");
    } finally {
      setSubmitting(false);
    }
  };

  // Lọc dữ liệu an toàn
  const safeData = Array.isArray(data) ? data : [];
  const filteredData = safeData.filter(item =>
    (item.tenNhomCo || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 font-sans bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BicepsFlexed className="text-blue-600"/> Quản lý Nhóm Cơ
          </h2>
          <p className="text-gray-500 text-sm mt-1">Danh sách các nhóm cơ ({filteredData.length})</p>
        </div>
        <button 
            onClick={handleOpenCreate} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition shadow-sm">
            <Plus size={20} /> Thêm nhóm cơ mới
        </button>
      </div>

      <SearchBar placeholder="Tìm kiếm nhóm cơ..." value={searchTerm} onChange={setSearchTerm} />

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        {loading ? (
          <div className="p-12 text-center text-blue-600">Đang tải dữ liệu...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase">Tên Nhóm Cơ</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase">Mô Tả</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item.maNhomCo} className="hover:bg-blue-50/50 transition">
                      <td className="p-4 font-bold text-gray-800 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><BicepsFlexed size={16} /></div>
                          {item.tenNhomCo}
                      </td>
                      <td className="p-4 text-sm text-gray-600 max-w-md truncate">
                        {item.moTaNhomCo || <span className="text-gray-400 italic">Chưa có mô tả</span>}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleOpenEdit(item)} className="p-2 text-blue-600 bg-blue-50 rounded hover:bg-blue-100"><Edit size={16} /></button>
                          <button onClick={() => handleDelete(item.maNhomCo, item.tenNhomCo)} className="p-2 text-red-600 bg-red-50 rounded hover:bg-red-100"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={3} className="p-12 text-center text-gray-500"><Inbox className="mx-auto mb-2"/>Không tìm thấy dữ liệu.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <MuscleFormModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        initialData={editingItem}
        isSubmitting={submitting}
      />
    </div>
  );
};

export default MusclePage;