import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { Search, Plus, Filter, Trash2, Edit, Youtube, Dumbbell, X, CheckCircle } from 'lucide-react';

interface NhomCo {
  maNhomCo: number;
  tenNhomCo: string;
}

interface Exercise {
  maBaiTap: number;
  tenBaiTap: string;
  maNhomCo: number;
  NHOM_CO?: { tenNhomCo: string }; // Dữ liệu join từ backend
  mucDo: string;
  dungCuCanThiet: string;
  videoHuongDan: string;
  moTaBaiTap: string;
}

const Exercises: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [nhomCos, setNhomCos] = useState<NhomCo[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNhomCo, setFilterNhomCo] = useState('');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    tenBaiTap: '',
    maNhomCo: '',
    mucDo: 'Dễ',
    dungCuCanThiet: '',
    videoHuongDan: '',
    moTaBaiTap: ''
  });

  // Load dữ liệu ban đầu
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resExercises, resNhomCo] = await Promise.all([
          axiosClient.get('/exercises'),
          axiosClient.get('/exercises/nhom-co')
        ]);
        setExercises(resExercises.data.data || resExercises.data);
        setNhomCos(resNhomCo.data.data || resNhomCo.data);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Xử lý thêm bài tập
  const handleAddExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tenBaiTap || !formData.maNhomCo) return alert("Vui lòng nhập đủ thông tin!");

    try {
      setSubmitting(true);
      await axiosClient.post('/exercises', formData);
      
      alert("Thêm bài tập thành công!");
      setShowModal(false);
      setFormData({
        tenBaiTap: '', maNhomCo: '', mucDo: 'Dễ', 
        dungCuCanThiet: '', videoHuongDan: '', moTaBaiTap: ''
      });
      
      // Reload danh sách
      const res = await axiosClient.get('/exercises');
      setExercises(res.data.data || res.data);
    } catch (error) {
      alert("Lỗi khi thêm bài tập!");
    } finally {
      setSubmitting(false);
    }
  };

  // Xử lý xóa bài tập
  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài tập này?")) return;
    try {
      await axiosClient.delete(`/exercises/${id}`);
      setExercises(prev => prev.filter(ex => ex.maBaiTap !== id));
    } catch (error) {
      alert("Không thể xóa bài tập này (Có thể đang được sử dụng).");
    }
  };

  // Logic lọc danh sách
  const filteredList = exercises.filter(ex => {
    const matchName = ex.tenBaiTap.toLowerCase().includes(searchTerm.toLowerCase());
    const matchNhomCo = filterNhomCo ? ex.maNhomCo.toString() === filterNhomCo : true;
    return matchName && matchNhomCo;
  });

  return (
    <div className="p-6 font-sans text-gray-800">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Dumbbell className="text-blue-600"/> Kho Bài Tập Phục Hồi
          </h2>
          <p className="text-gray-500">Quản lý danh sách bài tập và video hướng dẫn</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-sm font-medium"
        >
          <Plus size={20} /> Thêm bài tập mới
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row gap-4 border border-gray-200">
        <div className="flex-1 flex items-center border rounded-lg px-3 bg-gray-50">
          <Search className="text-gray-400 mr-2" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm tên bài tập..." 
            className="flex-1 bg-transparent py-2 outline-none text-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center border rounded-lg px-3 bg-gray-50 md:w-64">
          <Filter className="text-gray-400 mr-2" size={18} />
          <select 
            className="flex-1 bg-transparent py-2 outline-none text-sm cursor-pointer"
            value={filterNhomCo}
            onChange={e => setFilterNhomCo(e.target.value)}
          >
            <option value="">-- Tất cả nhóm cơ --</option>
            {nhomCos.map(nc => (
              <option key={nc.maNhomCo} value={nc.maNhomCo}>{nc.tenNhomCo}</option>
            ))}
          </select>
        </div>
      </div>

      {/* DANH SÁCH BÀI TẬP (GRID VIEW) */}
      {loading ? (
        <div className="p-12 text-center text-blue-600">Đang tải dữ liệu...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map(ex => (
            <div key={ex.maBaiTap} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition p-5 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded uppercase">
                  {ex.NHOM_CO?.tenNhomCo || 'Khác'}
                </span>
                <div className="flex gap-1">
                  <button className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-gray-100"><Edit size={16}/></button>
                  <button onClick={() => handleDelete(ex.maBaiTap)} className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-gray-100"><Trash2 size={16}/></button>
                </div>
              </div>
              
              <h3 className="font-bold text-lg text-gray-800 mb-1">{ex.tenBaiTap}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">{ex.moTaBaiTap || 'Chưa có mô tả'}</p>
              
              <div className="mt-auto space-y-2 text-sm">
                <div className="flex items-center justify-between border-t pt-2">
                  <span className="text-gray-500">Mức độ:</span>
                  <span className={`font-medium ${ex.mucDo === 'Khó' ? 'text-red-600' : ex.mucDo === 'Trung bình' ? 'text-yellow-600' : 'text-green-600'}`}>
                    {ex.mucDo}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Dụng cụ:</span>
                  <span className="font-medium text-gray-700">{ex.dungCuCanThiet || 'Không cần'}</span>
                </div>
                {ex.videoHuongDan && (
                  <a 
                    href={ex.videoHuongDan} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2 mt-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium"
                  >
                    <Youtube size={18}/> Xem hướng dẫn
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL THÊM BÀI TẬP */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg flex items-center gap-2"><Plus size={20}/> Thêm Bài Tập Mới</h3>
              <button onClick={() => setShowModal(false)}><X size={20}/></button>
            </div>
            
            <form onSubmit={handleAddExercise} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium mb-1">Tên bài tập <span className="text-red-500">*</span></label>
                <input required type="text" className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500" 
                  value={formData.tenBaiTap} onChange={e => setFormData({...formData, tenBaiTap: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nhóm cơ <span className="text-red-500">*</span></label>
                  <select required className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={formData.maNhomCo} onChange={e => setFormData({...formData, maNhomCo: e.target.value})}>
                    <option value="">-- Chọn nhóm cơ --</option>
                    {nhomCos.map(nc => (
                      <option key={nc.maNhomCo} value={nc.maNhomCo}>{nc.tenNhomCo}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mức độ</label>
                  <select className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={formData.mucDo} onChange={e => setFormData({...formData, mucDo: e.target.value})}>
                    <option value="Dễ">Dễ</option>
                    <option value="Trung bình">Trung bình</option>
                    <option value="Khó">Khó</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Dụng cụ cần thiết</label>
                <input type="text" className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="VD: Thảm, Tạ tay..."
                  value={formData.dungCuCanThiet} onChange={e => setFormData({...formData, dungCuCanThiet: e.target.value})} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Link Video (YouTube)</label>
                <div className="flex items-center border rounded px-2 focus-within:ring-2 ring-blue-500">
                  <Youtube size={18} className="text-red-500 mr-2"/>
                  <input type="url" className="w-full p-2 outline-none" 
                    placeholder="https://youtube.com/..."
                    value={formData.videoHuongDan} onChange={e => setFormData({...formData, videoHuongDan: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mô tả kỹ thuật</label>
                <textarea rows={3} className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Hướng dẫn chi tiết cách tập..."
                  value={formData.moTaBaiTap} onChange={e => setFormData({...formData, moTaBaiTap: e.target.value})} />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded hover:bg-gray-100">Hủy</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2">
                  {submitting ? 'Đang lưu...' : <><CheckCircle size={18}/> Lưu bài tập</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exercises;