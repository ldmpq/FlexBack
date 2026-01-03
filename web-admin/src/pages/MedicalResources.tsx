import { useState, useEffect } from 'react';
import { Pill, Utensils, Plus, Trash2, Edit} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { resourceService } from '../services/resource.service';
import ResourceModal from '../components/forms/ResourceModal';
import SearchBar from '../components/SearchBar';

const MedicalResources = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = (searchParams.get('tab') as 'thuoc' | 'thucpham') || 'thuoc';

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setData([]); 
      try {
        if (activeTab === 'thuoc') {
          const res = await resourceService.getAllThuoc();
          setData(Array.isArray(res) ? res : []);
        } else {
          const res = await resourceService.getAllThucPham();
          setData(Array.isArray(res) ? res : []);
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    setSearchTerm('');
  }, [activeTab]);

  // Chuyển tab
  const handleSwitchTab = (tab: 'thuoc' | 'thucpham') => {
    setSearchParams({ tab }); 
  };

  // Lưu dữ liệu
  const handleSave = async (formData: any) => {
    try {
      if (activeTab === 'thuoc') {
        if (editingItem) {
          await resourceService.updateThuoc(editingItem.maThuoc, formData);
          alert("Cập nhật thuốc thành công!"); 
        } else {
          await resourceService.createThuoc(formData);
          alert("Thêm thuốc mới thành công!");
        }
      } else {
        if (editingItem) {
          await resourceService.updateThucPham(editingItem.maThucPham, formData);
          alert("Cập nhật thực phẩm thành công!");
        } else {
          await resourceService.createThucPham(formData);
          alert("Thêm thực phẩm mới thành công!");
        }
      }
      setIsModalOpen(false);
      window.location.reload(); 
    } catch (error) {
      alert("Có lỗi xảy ra khi lưu! Vui lòng thử lại.");
    }
  };

  // Xóa dữ liệu
  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa mục này không?")) return;
    try {
      if (activeTab === 'thuoc') await resourceService.deleteThuoc(id);
      else await resourceService.deleteThucPham(id);
      alert("Đã xóa thành công!");
      window.location.reload();
    } catch (error) {
      alert("Không thể xóa bản ghi này (có thể đang được sử dụng).");
    }
  };

  // Filter tìm kiếm
  const safeData = Array.isArray(data) ? data : [];
  const filteredData = safeData.filter(item => {
    const name = activeTab === 'thuoc' ? item?.tenThuoc : item?.tenThucPham;
    return (name || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-in fade-in p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {activeTab === 'thuoc' ? 'Kho Thuốc' : 'Kho Thực phẩm'}
          </h2>
          <p className="text-gray-500 text-sm">
            {activeTab === 'thuoc' ? 'Quản lý danh mục thuốc men' : 'Quản lý danh mục dinh dưỡng'}
          </p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => handleSwitchTab('thuoc')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'thuoc' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Pill size={16}/> Thuốc
          </button>
          <button 
            onClick={() => handleSwitchTab('thucpham')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'thucpham' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Utensils size={16}/> Thực phẩm
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 max-w">
          <SearchBar 
            value={searchTerm} 
            onChange={setSearchTerm} 
            placeholder={`Tìm kiếm ${activeTab === 'thuoc' ? 'thuốc' : 'thực phẩm'}...`}
          />
        </div>

        <button 
          onClick={() => { setEditingItem(null); setIsModalOpen(true); }} 
          className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium shadow-sm shadow-blue-200 transition-colors mt-0.5"
        >
          <Plus size={18}/> Thêm mới
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium text-xs uppercase border-b border-gray-100">
            <tr>
              <th className="p-4 w-20">ID</th>
              <th className="p-4">Tên {activeTab === 'thuoc' ? 'Thuốc' : 'Thực phẩm'}</th>
              <th className="p-4">{activeTab === 'thuoc' ? 'Công dụng' : 'Chi tiết'}</th>
              <th className="p-4 w-32 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
            ) : filteredData.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">Chưa có dữ liệu.</td></tr>
            ) : (
              filteredData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 group">
                  <td className="p-4 text-gray-500 font-mono text-sm">#{activeTab === 'thuoc' ? item.maThuoc : item.maThucPham}</td>
                  <td className="p-4 font-semibold text-gray-800">{activeTab === 'thuoc' ? item?.tenThuoc : item?.tenThucPham}</td>
                  <td className="p-4 text-gray-600 text-sm max-w-md truncate">{activeTab === 'thuoc' ? item?.congDung : item?.chiTiet}</td>
                  <td className="p-4 flex justify-end gap-2">
                    <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="p-2 text-green-600 bg-green-50 rounded hover:bg-green-100"><Edit size={16}/></button>
                    <button onClick={() => handleDelete(activeTab === 'thuoc' ? item.maThuoc : item.maThucPham)} className="p-2 text-red-600 bg-red-50 rounded hover:bg-red-100"><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ResourceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        type={activeTab} 
        initialData={editingItem} 
        onSave={handleSave} 
      />
    </div>
  );
};

export default MedicalResources;