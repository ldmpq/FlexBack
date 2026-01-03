import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

interface ResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'thuoc' | 'thucpham';
  initialData?: any;
  onSave: (data: any) => void;
}

const ResourceModal = ({ isOpen, onClose, type, initialData, onSave }: ResourceModalProps) => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  // Reset form mỗi khi mở modal hoặc đổi dữ liệu
  useEffect(() => {
    if (initialData) {
      setName(type === 'thuoc' ? initialData.tenThuoc : initialData.tenThucPham);
      setDesc(type === 'thuoc' ? initialData.congDung : initialData.chiTiet);
    } else {
      setName('');
      setDesc('');
    }
  }, [initialData, type, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = type === 'thuoc' 
      ? { tenThuoc: name, congDung: desc } 
      : { tenThucPham: name, chiTiet: desc };
    onSave(payload);
  };

  // Xác định tiêu đề dựa trên loại
  const title = type === 'thuoc' ? 'Thuốc' : 'Thực phẩm';
  const labelDesc = type === 'thuoc' ? 'Công dụng / Chỉ định' : 'Chi tiết / Dinh dưỡng';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

        <div className="bg-blue-600 p-4 flex justify-between items-center shrink-0">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            {initialData ? `Cập Nhật ${title}` : `+ Thêm ${title} Mới`}
          </h3>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X size={24}/>
          </button>
        </div>

        {/* --- BODY --- */}
        <div className="p-6 space-y-5">
          <form id="resourceForm" onSubmit={handleSubmit} className="space-y-5">
            {/* Tên */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Tên {title} <span className="text-red-500">*</span>
              </label>
              <input 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder={`Nhập tên ${title.toLowerCase()}...`}
              />
            </div>

            {/* Mô tả */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {labelDesc}
              </label>
              <textarea 
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all"
                placeholder="Nhập thông tin mô tả chi tiết..."
              />
            </div>
          </form>
        </div>

        {/* --- FOOTER --- */}
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3 shrink-0">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
          >
            Hủy
          </button>
          <button 
            type="submit"
            form="resourceForm"
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-sm shadow-blue-200 flex items-center gap-2 transition-colors"
          >
            <Save size={18}/> Lưu lại
          </button>
        </div>

      </div>
    </div>
  );
};

export default ResourceModal;