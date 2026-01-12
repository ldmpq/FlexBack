import { useState, useEffect } from 'react';
import { FileText, ChevronRight, User, Clock, Search, Activity, CheckCircle, XCircle, UserCog } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import axiosClient from '../utils/axiosClient';

// Định nghĩa kiểu cho 2 loại tab
type TabType = 'PATIENT_REPORT' | 'KTV_EVALUATION';

const ReportsList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('PATIENT_REPORT');
  
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Hàm load dữ liệu dựa trên Tab đang chọn
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setReports([]); // Reset data khi chuyển tab
      try {
        let url = '';
        if (activeTab === 'PATIENT_REPORT') {
            url = '/baocao/all';
        } else {
            url = '/baocao/ktv-evaluations'; // API mới tạo ở Bước 1
        }

        const res = await axiosClient.get(url);
        
        // Xử lý dữ liệu trả về linh hoạt
        if (res.data && Array.isArray(res.data)) {
            setReports(res.data);
        } else if (res.data && res.data.data && Array.isArray(res.data.data)) {
            setReports(res.data.data);
        } else {
            setReports([]);
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  // --- Helpers lấy tên Bệnh nhân ---
  const getPatientName = (item: any) => {
    try {
      if (activeTab === 'PATIENT_REPORT') {
        const path1 = item?.KeHoachDieuTri?.LoTrinhDieuTri?.MucTieuDieuTri?.HoSoBenhAn?.BenhNhan?.TaiKhoan?.hoVaTen;
        const path2 = item?.KeHoachDieuTri?.LoTrinhDieuTri?.HoSoBenhAn?.BenhNhan?.TaiKhoan?.hoVaTen;
        return path1 || path2 || 'Ẩn danh';
      } else {
        // Cấu trúc của KTV Evaluation
        return item?.HoSoBenhAn?.BenhNhan?.TaiKhoan?.hoVaTen || 'Ẩn danh';
      }
    } catch (e) {
      return 'Lỗi dữ liệu';
    }
  };

  // Helper lấy thông tin phụ (Kế hoạch hoặc Tên KTV)
  const getSecondaryInfo = (item: any) => {
    if (activeTab === 'PATIENT_REPORT') {
        const tenLoTrinh = item?.KeHoachDieuTri?.LoTrinhDieuTri?.tenLoTrinh;
        const tenKeHoach = item?.KeHoachDieuTri?.tenKeHoach;
        return tenLoTrinh || tenKeHoach || 'Không xác định';
    } else {
        return item?.KyThuatVien?.TaiKhoan?.hoVaTen || 'KTV ẩn danh';
    }
  };

  // Filter dữ liệu theo từ khóa tìm kiếm
  const filteredData = reports.filter(item => {
    if (!item) return false;
    const name = getPatientName(item).toLowerCase();
    const info = getSecondaryInfo(item).toLowerCase();
    const search = searchTerm.toLowerCase();
    return name.includes(search) || info.includes(search);
  });

  return (
    <div className="p-6 font-sans text-gray-800 animate-in fade-in space-y-6">
      
      {/* --- HEADER & SWITCHER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {activeTab === 'PATIENT_REPORT' ? (
                <><FileText className="text-blue-600" /> Bệnh nhân</>
            ) : (
                <><Activity className="text-purple-600" /> Kỹ thuật viên</>
            )}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {activeTab === 'PATIENT_REPORT' 
                ? 'Danh sách phản hồi kết quả tập luyện từ bệnh nhân' 
                : 'Danh sách đánh giá tiến độ do Kỹ thuật viên gửi lên'}
          </p>
        </div>

        {/* Nút Switcher */}
        <div className="bg-gray-100 p-1 rounded-xl flex items-center shadow-inner">
            <button 
                onClick={() => setActiveTab('PATIENT_REPORT')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === 'PATIENT_REPORT' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                <User size={16} /> Bệnh nhân gửi
            </button>
            <button 
                onClick={() => setActiveTab('KTV_EVALUATION')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === 'KTV_EVALUATION' 
                    ? 'bg-white text-purple-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                <UserCog size={16} /> KTV gửi
            </button>
        </div>
      </div>

      <SearchBar 
        value={searchTerm} 
        onChange={setSearchTerm} 
        placeholder={activeTab === 'PATIENT_REPORT' ? "Tìm theo tên bệnh nhân, lộ trình..." : "Tìm theo tên bệnh nhân, tên KTV..."}
      />

      {/* --- TABLE --- */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        {loading ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
            Đang tải dữ liệu...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Bệnh nhân</th>
                  
                  {/* Cột động dựa theo Tab */}
                  {activeTab === 'PATIENT_REPORT' ? (
                      <>
                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kế hoạch / Lộ trình</th>
                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Thời lượng</th>
                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mức độ đau</th>
                      </>
                  ) : (
                      <>
                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kỹ thuật viên</th>
                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kết quả</th>
                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/3">Nhận xét</th>
                      </>
                  )}

                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày gửi</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.length > 0 ? filteredData.map((item) => (
                  <tr 
                    key={activeTab === 'PATIENT_REPORT' ? item.maBaoCao : item.maDanhGia} 
                    onClick={() => {
                        if (activeTab === 'PATIENT_REPORT') {
                            navigate(`/admin/reports/${item.maBaoCao}`);
                        }
                    }}
                    className={`hover:bg-blue-50 transition duration-150 group ${activeTab === 'PATIENT_REPORT' ? 'cursor-pointer' : ''}`}
                  >
                    {/* ID */}
                    <td className="p-4 font-mono text-xs text-gray-500">
                        #{activeTab === 'PATIENT_REPORT' ? item.maBaoCao : item.maDanhGia}
                    </td>
                    
                    {/* Bệnh nhân */}
                    <td className="p-4">
                        <div className="flex items-center gap-3">
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                               activeTab === 'PATIENT_REPORT' ? 'bg-blue-100 text-blue-600 border-blue-200' : 'bg-purple-100 text-purple-600 border-purple-200'
                           }`}>
                             <User size={14} strokeWidth={2.5}/>
                           </div>
                           <span className="font-bold text-gray-800 text-sm">{getPatientName(item)}</span>
                        </div>
                    </td>

                    {/* Nội dung thay đổi theo Tab */}
                    {activeTab === 'PATIENT_REPORT' ? (
                        <>
                            <td className="p-4">
                                <div className="text-sm text-gray-700 font-medium truncate max-w-[200px]" title={getSecondaryInfo(item)}>
                                    {getSecondaryInfo(item)}
                                </div>
                            </td>
                            <td className="p-4">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                                    <Clock size={12}/> {item.thoiLuong} phút
                                </span>
                            </td>
                            <td className="p-4">
                                <div className={`px-2.5 py-1 rounded text-xs font-bold w-fit border ${
                                    item.mucDoDau >= 7 ? 'bg-red-50 text-red-600 border-red-200' : 
                                    item.mucDoDau >= 4 ? 'bg-orange-50 text-orange-600 border-orange-200' : 
                                    'bg-green-50 text-green-600 border-green-200'
                                }`}>
                                    Mức {item.mucDoDau}/10
                                </div>
                            </td>
                        </>
                    ) : (
                        <>
                            {/* Cột KTV */}
                            <td className="p-4">
                                <div className="flex items-center gap-2">
                                    <UserCog size={14} className="text-gray-400"/>
                                    <span className="text-sm text-gray-700 font-medium">{getSecondaryInfo(item)}</span>
                                </div>
                            </td>
                            {/* Cột Kết quả */}
                            <td className="p-4">
                                {item.ketQua ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 text-xs font-bold">
                                        <CheckCircle size={12} /> Đạt
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold">
                                        <XCircle size={12} /> Không đạt
                                    </span>
                                )}
                            </td>
                            {/* Cột Nhận xét */}
                            <td className="p-4">
                                <p className="text-sm text-gray-600 italic truncate max-w-[250px]" title={item.chiTiet || item.nhanXet}>
                                    "{item.chiTiet || item.nhanXet || 'Không có nhận xét'}"
                                </p>
                            </td>
                        </>
                    )}
                    
                    {/* Ngày gửi */}
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(item.ngayLuyenTap || item.ngayDanhGia).toLocaleDateString('vi-VN')}
                    </td>
                    
                    {/* Action Arrow (Chỉ hiện cho Patient Report) */}
                    <td className="p-4 text-right">
                      {activeTab === 'PATIENT_REPORT' && (
                          <div className="p-2 text-gray-400 group-hover:text-blue-600 transition-colors inline-block rounded-full group-hover:bg-blue-100">
                            <ChevronRight size={18} />
                          </div>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <Search size={48} className="text-gray-200 mb-4 opacity-50" />
                        <p className="text-lg font-medium">Chưa có dữ liệu nào.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsList;