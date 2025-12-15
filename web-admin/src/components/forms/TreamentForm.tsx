import React, { useState, useEffect } from 'react';
import { Map, X } from 'lucide-react';
import type { TreatmentFormProps } from '../../types/treatment.type';

const TreatmentForm: React.FC<TreatmentFormProps> = ({ isOpen, onClose, onSubmit, submitting, listKTV }) => {
  const initialState = {
    tenLoTrinh: '',
    maKyThuatVien: '',
    thoiGianBatDau: new Date().toISOString().split('T')[0],
    thoiGianKetThuc: '',
    ghiChu: ''
  };

  const [formData, setFormData] = useState(initialState);

  // Reset form khi mở modal
  useEffect(() => {
    if (isOpen) {
      setFormData(initialState);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in zoom-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Map size={20} /> Thêm Giai đoạn cho Lộ Trình
          </h3>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded transition">
            <X size={20} />
          </button>
        </div>
        
        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tên giai đoạn <span className="text-red-500">*</span></label>
            <input 
              required 
              type="text" 
              className="w-full border border-gray-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
              value={formData.tenLoTrinh} 
              onChange={e => setFormData({ ...formData, tenLoTrinh: e.target.value })} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">KTV Phụ trách</label>
            <select 
              className="w-full border border-gray-300 p-2.5 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500" 
              value={formData.maKyThuatVien} 
              onChange={e => setFormData({ ...formData, maKyThuatVien: e.target.value })}
            >
              <option value="">-- Chưa phân công --</option>
              
              {listKTV && listKTV.length > 0 ? (
                listKTV.map((ktv: any) => (
                  <option key={ktv.maKyThuatVien} value={ktv.maKyThuatVien}>
                    KTV. {ktv.TaiKhoan?.hoVaTen || `Mã ${ktv.maKyThuatVien}`}
                  </option>
                ))
              ) : (
                <option disabled>-- Đang tải --</option>
              )}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Bắt đầu <span className="text-red-500">*</span></label>
              <input 
                type="date" 
                required 
                className="w-full border border-gray-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                value={formData.thoiGianBatDau} 
                onChange={e => setFormData({ ...formData, thoiGianBatDau: e.target.value })} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kết thúc <span className="text-red-500">*</span></label>
              <input 
                type="date" 
                required 
                className="w-full border border-gray-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                value={formData.thoiGianKetThuc} 
                onChange={e => setFormData({ ...formData, thoiGianKetThuc: e.target.value })} 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Ghi chú</label>
            <textarea 
              className="w-full border border-gray-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
              rows={2} 
              value={formData.ghiChu} 
              onChange={e => setFormData({ ...formData, ghiChu: e.target.value })} 
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t mt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              disabled={submitting} 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition disabled:opacity-70"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TreatmentForm;