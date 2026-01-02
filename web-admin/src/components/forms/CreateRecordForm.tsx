import React from 'react';
import { X, CheckCircle } from 'lucide-react';

interface CreateRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: {
    chanDoan: string;
    trangThaiHienTai: string;
    maBacSi: string;
  };
  setFormData: (data: any) => void;
  submitting: boolean;
  listBacSi: any[];
  doctorsLoading: boolean;
}

const CreateRecordModal: React.FC<CreateRecordModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  submitting,
  listBacSi,
  doctorsLoading
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
          <h3 className="font-bold text-lg flex items-center gap-2">Tạo Hồ Sơ Mới</h3>
          <button onClick={onClose} className="hover:bg-blue-700 p-1 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {/* Input Chẩn đoán */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chẩn đoán bệnh <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              rows={3}
              placeholder="Nhập chẩn đoán..."
              value={formData.chanDoan}
              onChange={(e) => setFormData({ ...formData, chanDoan: e.target.value })}
            ></textarea>
          </div>

          {/* Input Tình trạng */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tình trạng hiện tại
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              value={formData.trangThaiHienTai}
              onChange={(e) => setFormData({ ...formData, trangThaiHienTai: e.target.value })}
            />
          </div>

          {/* Select Bác sĩ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chọn Bác sĩ phụ trách
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-blue-500 bg-white transition"
              value={formData.maBacSi}
              onChange={(e) => setFormData({ ...formData, maBacSi: e.target.value })}
            >
              <option value="">-- Chưa phân công --</option>

              {doctorsLoading ? (
                <option disabled>Đang tải danh sách...</option>
              ) : listBacSi && listBacSi.length > 0 ? (
                listBacSi.map((bs: any) => (
                  <option key={bs.maBacSi} value={bs.maBacSi}>
                    {bs.TaiKhoan?.hoVaTen || bs.hoVaTen || `Bác sĩ #${bs.maBacSi}`} {bs.chuyenKhoa ? `- ${bs.chuyenKhoa}` : ''}
                  </option>
                ))
              ) : (
                <option disabled>-- Không tìm thấy bác sĩ nào --</option>
              )}
            </select>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting ? 'Đang lưu...' : <><CheckCircle size={18} /> Lưu hồ sơ</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRecordModal;