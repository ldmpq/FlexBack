import { useState, useEffect } from 'react';
import { FileText, ChevronRight, User, Clock, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import axiosClient from '../utils/axiosClient';

const ReportsList = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axiosClient.get('/baocao/all');
        if (res.data && Array.isArray(res.data)) {
            setReports(res.data);
        } 
        else if (res.data && res.data.data && Array.isArray(res.data.data)) {
            setReports(res.data.data);
        }
        else {
            setReports([]);
        }
      } catch (error) {
        console.error("Lỗi tải báo cáo:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const getPatientName = (rp: any) => {
    try {
      const path1 = rp?.KeHoachDieuTri?.LoTrinhDieuTri?.MucTieuDieuTri?.HoSoBenhAn?.BenhNhan?.TaiKhoan?.hoVaTen;
      const path2 = rp?.KeHoachDieuTri?.LoTrinhDieuTri?.HoSoBenhAn?.BenhNhan?.TaiKhoan?.hoVaTen;

      if (path1) return path1;
      if (path2) return path2;
      
      return 'Ẩn danh';
    } catch (e) {
      return 'Lỗi dữ liệu';
    }
  };

  const getPlanInfo = (rp: any) => {
    const tenLoTrinh = rp?.KeHoachDieuTri?.LoTrinhDieuTri?.tenLoTrinh;
    const tenKeHoach = rp?.KeHoachDieuTri?.tenKeHoach;
    return tenLoTrinh || tenKeHoach || 'Không xác định';
  };

  const filteredReports = reports.filter(rp => {
    if (!rp) return false;
    const patientName = getPatientName(rp).toLowerCase();
    const planInfo = getPlanInfo(rp).toLowerCase();
    const search = searchTerm.toLowerCase();
    return patientName.includes(search) || planInfo.includes(search);
  });

  return (
    <div className="p-6 font-sans text-gray-800 animate-in fade-in">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="text-blue-600" /> Báo cáo Luyện tập
          </h2>
          <p className="text-gray-500 text-sm mt-1">Danh sách phản hồi kết quả tập luyện từ bệnh nhân</p>
        </div>
      </div>

      {/* --- SEARCH BAR --- */}
      <SearchBar 
        value={searchTerm} 
        onChange={setSearchTerm} 
        placeholder="Tìm kiếm theo tên bệnh nhân hoặc tên kế hoạch..."
      />

      {/* --- TABLE --- */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 mt-6">
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
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kế hoạch / Lộ trình</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Thời lượng</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mức độ đau</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày gửi</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredReports.length > 0 ? filteredReports.map((rp) => (
                  <tr 
                    key={rp.maBaoCao} 
                    onClick={() => navigate(`/admin/reports/${rp.maBaoCao}`)}
                    className="hover:bg-blue-50 transition duration-150 cursor-pointer group"
                  >
                    <td className="p-4 font-mono text-xs text-gray-500">#{rp.maBaoCao}</td>
                    
                    {/* Cột Bệnh nhân */}
                    <td className="p-4">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center border border-blue-200">
                            <User size={14} strokeWidth={2.5}/>
                          </div>
                          <span className="font-bold text-gray-800 text-sm">{getPatientName(rp)}</span>
                       </div>
                    </td>

                    {/* Cột Kế hoạch */}
                    <td className="p-4">
                      <div className="text-sm text-gray-700 font-medium truncate max-w-[200px]" title={getPlanInfo(rp)}>
                        {getPlanInfo(rp)}
                      </div>
                    </td>

                    {/* Cột Thời lượng */}
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                        <Clock size={12}/> {rp.thoiLuong} phút
                      </span>
                    </td>
                    
                    {/* Cột Mức độ đau */}
                    <td className="p-4">
                      <div className={`px-2.5 py-1 rounded text-xs font-bold w-fit border ${
                        rp.mucDoDau >= 7 ? 'bg-red-50 text-red-600 border-red-200' : 
                        rp.mucDoDau >= 4 ? 'bg-orange-50 text-orange-600 border-orange-200' : 
                        'bg-green-50 text-green-600 border-green-200'
                      }`}>
                        Mức {rp.mucDoDau}/10
                      </div>
                    </td>
                    
                    {/* Cột Ngày gửi */}
                    <td className="p-4 text-sm text-gray-500">
                      {rp.ngayLuyenTap ? new Date(rp.ngayLuyenTap).toLocaleDateString('vi-VN') : '-'}
                    </td>
                    
                    {/* Cột Action */}
                    <td className="p-4 text-right">
                      <div className="p-2 text-gray-400 group-hover:text-blue-600 transition-colors inline-block rounded-full group-hover:bg-blue-100">
                        <ChevronRight size={18} />
                      </div>
                    </td>
                  </tr>
                )) : (

                  <tr>
                    <td colSpan={7} className="p-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <Search size={48} className="text-gray-200 mb-4 opacity-50" />
                        <p className="text-lg font-medium">Không tìm thấy báo cáo nào.</p>
                        <p className="text-sm text-gray-400">Thử tìm kiếm với từ khóa khác.</p>
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