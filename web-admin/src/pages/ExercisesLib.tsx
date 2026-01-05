import React from 'react';
import { Plus, Filter, Trash2, Edit, Youtube, Dumbbell, Upload } from 'lucide-react';
import { useExerciseManager } from '../hooks/useExerciseManager';
import SearchBar from '../components/SearchBar';
import ExerciseForm from '../components/forms/ExerciseForm';

const Exercises: React.FC = () => {
  const {
    filteredList, nhomCos, loading,
    searchTerm, setSearchTerm, filterNhomCo, setFilterNhomCo,
    showModal, setShowModal, submitting,
    formData, setFormData,
    videoInputType, setVideoInputType, videoFile, setVideoFile,
    handleSubmit, handleDelete, handleEdit, resetForm, isYoutubeLink,
    editingId
  } = useExerciseManager();

  return (
    <div className="p-6 font-sans text-gray-800">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Dumbbell className="text-blue-600" /> Kho Bài Tập
          </h2>
          <p className="text-gray-500 text-sm mt-1">Quản lý bài tập & Video hướng dẫn ({loading ? '...' : filteredList.length})</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-sm font-medium"
        >
          <Plus size={20} /> Thêm bài tập
        </button>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white p-2 rounded shadow-sm mb-3 flex flex-col md:flex-row gap-2 border border-gray-200">
        <div className="flex-1 ">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Tìm kiếm tên bài tập..."
            className="mb-0 shadow-none border-0 bg-gray-50 px-0 py-1"
          />
        </div>

        <div className="flex items-center border rounded px-2 bg-gray-50 md:w-56 border-gray-200">
          <Filter className="text-gray-400 mr-2" size={16} />
          <select
            className="flex-1 bg-transparent py-1 outline-none text-sm cursor-pointer text-gray-700"
            value={filterNhomCo}
            onChange={e => setFilterNhomCo(e.target.value)}
          >
            <option value="">- Tất cả nhóm cơ -</option>
            {nhomCos.map(nc => (
              <option key={nc.maNhomCo} value={nc.maNhomCo}>{nc.tenNhomCo}</option>
            ))}
          </select>
        </div>
      </div>


      {/* LIST */}
      {loading ? <div className="p-12 text-center text-blue-600">Đang tải dữ liệu...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map(ex => (
            <div key={ex.maBaiTap} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition p-5 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded uppercase">
                  {ex.NHOM_CO?.tenNhomCo || 'Khác'}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(ex)}
                    className="p-1.5 text-gray-400 hover:text-green-600 rounded hover:bg-gray-100"
                    title="Chỉnh sửa"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(ex.maBaiTap)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-gray-100"
                    title="Xóa"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-1">{ex.tenBaiTap}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">{ex.moTaBaiTap || 'Chưa có mô tả'}</p>

              <div className="mt-auto space-y-2 text-sm border-t pt-3">
                <div className="flex justify-between"><span className="text-gray-500">Mức độ:</span> <span className={`font-medium ${ex.mucDo === 'Khó' ? 'text-red-500' : 'text-green-600'}`}>{ex.mucDo}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Dụng cụ:</span> <span className="font-medium text-gray-700">{ex.dungCuCanThiet || 'Không'}</span></div>
                {ex.videoHuongDan && (
                  <a href={isYoutubeLink(ex.videoHuongDan) ? ex.videoHuongDan : `/uploads/videos/${ex.videoHuongDan}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2 mt-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium">
                    {isYoutubeLink(ex.videoHuongDan) ? <Youtube size={18} /> : <Upload size={18} />} Xem Video
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL FORM */}
      <ExerciseForm
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        submitting={submitting}
        editingId={editingId}
        formData={formData}
        setFormData={setFormData}
        nhomCos={nhomCos}
        videoInputType={videoInputType}
        setVideoInputType={setVideoInputType}
        videoFile={videoFile}
        setVideoFile={setVideoFile}
      />
    </div>
  );
};

export default Exercises;


