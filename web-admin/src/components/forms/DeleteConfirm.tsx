import React from 'react';
import { AlertCircle, X, Trash2 } from 'lucide-react';

type DeleteType = 'GOAL' | 'ROUTE';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  type: DeleteType;
  isSubmitting?: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  itemName, 
  type,
  isSubmitting = false
}) => {
  if (!isOpen) return null;

  // Cấu hình nội dung dựa trên type
  const config = {
    GOAL: {
      title: "Xóa Mục tiêu điều trị?",
      warning: "Hành động này sẽ xóa tất cả các Lộ trình và Bài tập nằm trong mục tiêu này.",
      badgeColor: "bg-red-50 text-red-600 border-red-100"
    },
    ROUTE: {
      title: "Xóa Lộ trình điều trị?",
      warning: "Hành động này sẽ xóa tất cả các bài tập đã gán trong lộ trình này.",
      badgeColor: "bg-orange-50 text-orange-600 border-orange-100"
    }
  };

  const currentConfig = config[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-red-100 rounded-full text-red-600">
              <AlertCircle size={24} />
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {currentConfig.title}
          </h3>
          
          <div className="text-gray-600 mb-6">
            Bạn có chắc chắn muốn xóa: <br/>
            <span className="font-bold text-gray-800 text-lg block my-1">"{itemName}"</span>
            
            <div className={`mt-3 p-3 rounded-lg text-sm border ${currentConfig.badgeColor}`}>
              <span className="font-bold">Lưu ý:</span> {currentConfig.warning} <br/>
              <span className="italic">Hành động này không thể hoàn tác.</span>
            </div>
          </div>
          
          {/* Footer / Buttons */}
          <div className="flex justify-end gap-3">
            <button 
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button 
              onClick={onConfirm}
              disabled={isSubmitting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                 <span>Đang xóa...</span>
              ) : (
                 <><Trash2 size={16} /> Xác nhận xóa</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;