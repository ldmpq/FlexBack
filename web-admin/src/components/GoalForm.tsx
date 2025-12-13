import React, { useState, useEffect } from 'react';
import { Target, X, CheckCircle } from 'lucide-react';
import type { GoalFormProps } from '../types/goal.type';

const GoalForm: React.FC<GoalFormProps> = ({ isOpen, onClose, onSubmit, submitting }) => {
  const initialState = {
    noiDung: '',
    mucDoUuTien: 'Cao',
    ngayDatMucTieu: new Date().toISOString().split('T')[0],
    trangThai: 'ChuaHoanThanh'
  };
  
  const [formData, setFormData] = useState(initialState);

  // Reset form mỗi khi mở Modal
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
            <Target size={20}/> Thêm Mục Tiêu
          </h3>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded transition">
            <X size={20}/>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nội dung mục tiêu <span className="text-red-500">*</span>
            </label>
            <textarea 
              required
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" 
              rows={3}
              placeholder="Nhập nội dung chi tiết..." 
              value={formData.noiDung} 
              onChange={e => setFormData({...formData, noiDung: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mức độ ưu tiên
            </label>
            <select 
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition" 
              value={formData.mucDoUuTien} 
              onChange={e => setFormData({...formData, mucDoUuTien: e.target.value})}
            >
              <option value="Cao">Cao</option>
              <option value="BinhThuong">Bình thường</option>
              <option value="Thap">Thấp</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select 
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition" 
              value={formData.trangThai} 
              onChange={e => setFormData({...formData, trangThai: e.target.value})}
            >
              <option value="HoanThanh">Hoàn thành</option>
              <option value="ChuaHoanThanh">Chưa hoàn thành</option>
              <option value="DangThucHien">Đang thực hiện</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày đặt mục tiêu
            </label>
            <input 
              type="date" 
              required
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" 
              value={formData.ngayDatMucTieu} 
              onChange={e => setFormData({...formData, ngayDatMucTieu: e.target.value})}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t mt-2">
            <button 
              type="button"
              onClick={onClose} 
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 transition disabled:opacity-70"
            >
              {submitting ? 'Đang lưu...' : <><CheckCircle size={18}/> Lưu mục tiêu</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalForm;