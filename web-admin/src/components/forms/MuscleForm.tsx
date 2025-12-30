import React, { useState, useEffect } from 'react';
import { X, Save, Plus } from 'lucide-react';
import type { CreateNhomCoDTO, NhomCo } from '../../types/muscle.type';

interface MuscleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateNhomCoDTO) => Promise<void>;
  initialData?: NhomCo | null; // Dùng để xác định Edit hay Create
  isSubmitting: boolean;
}

const MuscleFormModal: React.FC<MuscleFormModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData, 
  isSubmitting 
}) => {
  // State quản lý form
  const [formData, setFormData] = useState<CreateNhomCoDTO>({ 
    tenNhomCo: '', 
    moTaNhomCo: '' 
  });

  // Reset form khi mở modal hoặc đổi item
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          tenNhomCo: initialData.tenNhomCo,
          moTaNhomCo: initialData.moTaNhomCo || ''
        });
      } else {
        setFormData({ tenNhomCo: '', moTaNhomCo: '' });
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  const isEditing = !!initialData;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in zoom-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        
        <div className={`p-4 flex justify-between items-center text-white ${isEditing ? 'bg-orange-500' : 'bg-blue-600'}`}>
          <h3 className="font-bold text-lg flex items-center gap-2">
            {isEditing ? <Save size={20}/> : <Plus size={20}/>} 
            {isEditing ? 'Cập Nhật Nhóm Cơ' : 'Thêm Nhóm Cơ Mới'}
          </h3>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded transition">
            <X size={20}/>
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Input Tên Nhóm Cơ */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Tên nhóm cơ <span className="text-red-500">*</span>
            </label>
            <input 
              required 
              className="w-full border border-gray-300 p-2 rounded outline-none focus:ring-2 focus:ring-blue-500 transition" 
              placeholder="Ví dụ: Cơ Ngực"
              value={formData.tenNhomCo}
              onChange={e => setFormData({...formData, tenNhomCo: e.target.value})}
            />
          </div>

          {/* Textarea Mô Tả */}
          <div>
            <label className="block text-sm font-medium mb-1">Mô tả</label>
            <textarea 
              rows={3}
              className="w-full border border-gray-300 p-2 rounded outline-none focus:ring-2 focus:ring-blue-500 transition" 
              placeholder="Mô tả chi tiết..."
              value={formData.moTaNhomCo || ''}
              onChange={e => setFormData({...formData, moTaNhomCo: e.target.value})}
            />
          </div>

          {/* FOOTER BUTTONS */}
          <div className="flex justify-end gap-3 pt-4 border-t mt-2">
             <button 
               type="button" 
               onClick={onClose} 
               className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition text-gray-700"
             >
               Hủy
             </button>
             <button 
               type="submit" 
               disabled={isSubmitting} 
               className={`px-4 py-2 text-white rounded flex items-center gap-2 transition disabled:opacity-70 
                 ${isEditing ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}
             >
               {isSubmitting ? 'Đang lưu...' : (
                 <>
                   <Save size={18}/> {isEditing ? 'Cập nhật' : 'Lưu nhóm cơ'}
                 </>
               )}
             </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default MuscleFormModal;