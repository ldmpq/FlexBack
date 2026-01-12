import React from 'react';
import { X, Save, Upload, Link as LinkIcon, Plus, CheckCircle } from 'lucide-react';
import type {ExerciseFormProps } from '../../types/exercise.type';

const ExerciseForm: React.FC<ExerciseFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  submitting,
  editingId,
  formData,
  setFormData,
  nhomCos,
  videoInputType,
  setVideoInputType,
  videoFile,
  setVideoFile,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in zoom-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className={`p-4 flex justify-between items-center text-white ${editingId ? 'bg-orange-500' : 'bg-blue-600'}`}>
          <h3 className="font-bold text-lg flex items-center gap-2">
            {editingId ? <Save size={20}/> : <Plus size={20}/>} 
            {editingId ? 'Cập Nhật Bài Tập' : 'Thêm Bài Tập Mới'}
          </h3>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded transition"><X size={20}/></button>
        </div>
        
        {/* Form Body */}
        <form onSubmit={onSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium mb-1">Tên bài tập <span className="text-red-500">*</span></label>
            <input 
              required 
              className="w-full border border-gray-300 p-2 rounded outline-none focus:ring-2 focus:ring-blue-500 transition" 
              value={formData.tenBaiTap} 
              onChange={e => setFormData({...formData, tenBaiTap: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nhóm cơ <span className="text-red-500">*</span></label>
              <select 
                required 
                className="w-full border border-gray-300 p-2 rounded bg-white outline-none focus:ring-2 focus:ring-blue-500 transition" 
                value={formData.maNhomCo} 
                onChange={e => setFormData({...formData, maNhomCo: e.target.value})}
              >
                <option value="">-- Chọn --</option>
                {nhomCos.map(nc => (
                  <option key={nc.maNhomCo} value={nc.maNhomCo}>{nc.tenNhomCo}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mức độ</label>
              <select 
                className="w-full border border-gray-300 p-2 rounded bg-white outline-none focus:ring-2 focus:ring-blue-500 transition" 
                value={formData.mucDo} 
                onChange={e => setFormData({...formData, mucDo: e.target.value})}
              >
                <option value="Dễ">Dễ</option>
                <option value="Trung bình">Trung bình</option>
                <option value="Khó">Khó</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Dụng cụ</label>
            <input 
              className="w-full border border-gray-300 p-2 rounded outline-none focus:ring-2 focus:ring-blue-500 transition" 
              value={formData.dungCuCanThiet} 
              onChange={e => setFormData({...formData, dungCuCanThiet: e.target.value})}
            />
          </div>
          
          {/* Video Input */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">
              Video Hướng dẫn {editingId && <span className="text-xs text-gray-500 font-normal ml-1">(Bỏ qua nếu không đổi)</span>}
            </label>
            <div className='flex gap-3 mb-3'>
                <button 
                  type="button" 
                  onClick={() => { setVideoInputType('link'); setVideoFile(null); }} 
                  className={`px-3 py-1.5 rounded border text-sm transition flex items-center gap-1 ${videoInputType === 'link' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-gray-50 hover:bg-gray-100'}`}
                >
                  <LinkIcon size={14}/> Link YouTube
                </button>
                <button 
                  type="button" 
                  onClick={() => { setVideoInputType('file'); setFormData({...formData, videoLink: ''}); }} 
                  className={`px-3 py-1.5 rounded border text-sm transition flex items-center gap-1 ${videoInputType === 'file' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-gray-50 hover:bg-gray-100'}`}
                >
                  <Upload size={14}/> Upload File
                </button>
            </div>
            
            {videoInputType === 'link' ? (
                <input 
                  type="url" 
                  className="w-full border border-gray-300 p-2 rounded outline-none focus:ring-2 focus:ring-blue-500 transition" 
                  placeholder="https://youtube.com/..." 
                  value={formData.videoLink} 
                  onChange={e => setFormData({...formData, videoLink: e.target.value})} 
                />
            ) : (
                <div className="border border-dashed border-gray-300 p-4 rounded text-center hover:bg-gray-50 transition relative">
                    <input 
                      type="file" 
                      accept="video/*" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={e => setVideoFile(e.target.files ? e.target.files[0] : null)} 
                    />
                    <div className="pointer-events-none">
                      {videoFile ? (
                        <p className="text-sm text-green-600 font-medium flex items-center justify-center gap-2">
                          <CheckCircle size={16}/> {videoFile.name}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                          <Upload size={16}/> Kéo thả hoặc click để chọn video
                        </p>
                      )}
                    </div>
                </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mô tả</label>
            <textarea 
              rows={3} 
              className="w-full border border-gray-300 p-2 rounded outline-none focus:ring-2 focus:ring-blue-500 transition" 
              value={formData.moTaBaiTap} 
              onChange={e => setFormData({...formData, moTaBaiTap: e.target.value})}
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition text-gray-700"
            >
              Hủy
            </button>
            <button 
                type="submit" 
                disabled={submitting} 
                className={`px-4 py-2 text-white rounded flex items-center gap-2 transition disabled:opacity-70 ${editingId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
                {submitting ? 'Đang lưu...' : <><Save size={18}/> {editingId ? 'Cập nhật' : 'Lưu bài tập'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExerciseForm;