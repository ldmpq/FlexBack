import { useState, useEffect } from 'react';
import { FileText, ChevronRight, User, Clock, Activity } from 'lucide-react';
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
    console.log("Kiểm tra Report:", rp); 

    try {
      const path1 = rp?.KeHoachDieuTri?.LoTrinhDieuTri?.MucTieuDieuTri?.HoSoBenhAn?.BenhNhan?.TaiKhoan?.hoVaTen;
      const path2 = rp?.KeHoachDieuTri?.LoTrinhDieuTri?.HoSoBenhAn?.BenhNhan?.TaiKhoan?.hoVaTen;

      if (path1) return path1;
      if (path2) return path2;
      
      return 'Ẩn danh (Mất kết nối dữ liệu)';
    } catch (e) {
      return 'Lỗi cấu trúc';
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
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FileText className="text-blue-600" /> Báo cáo Luyện tập
        </h2>
        <p className="text-gray-500">Danh sách phản hồi từ bệnh nhân gửi về hệ thống</p>
      </div>

      <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Tìm theo tên bệnh nhân hoặc kế hoạch..."/>

      {/* Bảng dữ liệu */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <Activity className="animate-spin text-blue-500 mb-2" size={24}/>
            Đang tải dữ liệu...
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Chưa có báo cáo nào.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium text-sm">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Bệnh nhân</th>
                <th className="p-4">Kế hoạch</th>
                <th className="p-4">Thời lượng tập</th>
                <th className="p-4">Mức độ đau</th>
                <th className="p-4">Ngày gửi</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReports.map((rp) => (
                <tr 
                  key={rp.maBaoCao} 
                  onClick={() => navigate(`/admin/reports/${rp.maBaoCao}`)}
                  className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                >
                  <td className="p-4 font-mono text-gray-500">#{rp.maBaoCao}</td>
                  
                  <td className="p-4 font-semibold text-gray-800">
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          <User size={14}/>
                        </div>
                        {getPatientName(rp)}
                     </div>
                  </td>

                  <td className="p-4 text-gray-700 font-medium truncate max-w-[200px]" title={getPlanInfo(rp)}>
                    {getPlanInfo(rp)}
                  </td>

                  <td className="p-4 text-gray-600">
                    <span className="flex items-center gap-1"><Clock size={14}/> {rp.thoiLuong}p</span>
                  </td>
                  
                  <td className="p-4">
                    <div className={`px-2 py-1 rounded-md text-xs font-bold w-fit border ${
                      rp.mucDoDau >= 7 ? 'bg-red-50 text-red-600 border-red-200' : 
                      rp.mucDoDau >= 4 ? 'bg-orange-50 text-orange-600 border-orange-200' : 
                      'bg-green-50 text-green-600 border-green-200'
                    }`}>
                      Mức {rp.mucDoDau}/10
                    </div>
                  </td>
                  
                  <td className="p-4 text-gray-500 text-sm">
                    {rp.ngayLuyenTap ? new Date(rp.ngayLuyenTap).toLocaleDateString('vi-VN') : '-'}
                  </td>
                  
                  <td className="p-4 text-gray-400 group-hover:text-blue-600 text-right">
                    <ChevronRight size={20} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReportsList;