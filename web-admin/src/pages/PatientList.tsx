import { useState, useEffect } from 'react';
import { Phone, Calendar, Activity, MapPin, FileText, CalendarCheck, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import SearchBar from '../components/SearchBar';

const PatientList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Lấy thông tin người dùng hiện tại
  const currentUser = JSON.parse(localStorage.getItem('user_info') || '{}');

  useEffect(() => {
    const fetchAssignedPatients = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get('/benh-nhan/assigned'); 
        
        // Xử lý dữ liệu trả về linh hoạt
        const rawData = res.data.data || res.data || [];

        if (Array.isArray(rawData)) {
            setPatients(rawData);
        } else {
            setPatients([]);
        }

      } catch (error) {
        console.error("Lỗi tải danh sách bệnh nhân:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedPatients();
  }, []);

  const filteredPatients = patients.filter((p: any) => {
    const info = p.TaiKhoan || {}; 
    const name = (info.hoVaTen || p.hoVaTen || '').toLowerCase();
    const phone = (info.soDienThoai || p.soDienThoai || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    return name.includes(search) || phone.includes(search);
  });

  return (
    <div className="space-y-6 animate-in fade-in p-6">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <CalendarCheck className="text-blue-600" /> Danh sách Phân công
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Xin chào <strong className="text-blue-700">{currentUser.hoVaTen}</strong>, dưới đây là những bệnh nhân bạn đang phụ trách.
          </p>
        </div>
      </div>

      <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Tìm theo tên hoặc số điện thoại..." />

      {/* --- DANH SÁCH BỆNH NHÂN --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center min-h-[300px]">
            <Activity className="animate-spin text-blue-500 mb-3" size={32}/>
            <span className="font-medium">Đang tải danh sách bệnh nhân...</span>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="p-12 text-center text-gray-500 bg-gray-50 min-h-[300px] flex flex-col items-center justify-center">
             <User size={48} className="text-gray-300 mb-3"/>
             {searchTerm 
                ? 'Không tìm thấy bệnh nhân nào phù hợp với từ khóa.' 
                : 'Bạn chưa được phân công bệnh nhân nào.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-500 font-semibold text-xs uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="p-4 w-20">Mã BN</th>
                  <th className="p-4">Họ và Tên</th>
                  <th className="p-4">Liên hệ</th>
                  <th className="p-4">Tình trạng hồ sơ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPatients.map((p) => {
                  const latestRecord = p.HoSoBenhAn?.[0];
                  const info = p.TaiKhoan || {};

                  return (
                    <tr 
                        key={p.maTaiKhoan} 
                        onClick={() => navigate(`/admin/patients/${p.maTaiKhoan}`)}
                        className="hover:bg-blue-50/60 transition-colors group cursor-pointer"
                    >
                      {/* ID */}
                      <td className="p-4 font-mono text-gray-500 text-sm font-medium">
                        #{p.maTaiKhoan}
                      </td>
                      
                      {/* Tên & Thông tin cơ bản */}
                      <td className="p-4">
                        <div className="font-bold text-gray-800 text-base group-hover:text-blue-700 transition-colors">
                          {info.hoVaTen || 'Chưa cập nhật tên'}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                           <Calendar size={12}/> 
                           {info.ngaySinh ? new Date(info.ngaySinh).toLocaleDateString('vi-VN') : '--/--/----'} 
                           <span className="mx-1">•</span>
                           {info.gioiTinh || '---'}
                        </div>
                      </td>

                      {/* Liên hệ & Địa chỉ */}
                      <td className="p-4">
                         <div className="flex flex-col gap-1.5 text-sm text-gray-600">
                            <span className="flex items-center gap-2 font-medium">
                               <Phone size={14} className="text-green-600"/> {info.soDienThoai || '---'}
                            </span>
                            <span className="flex items-center gap-2 truncate max-w-[200px] text-gray-500" title={info.diaChi}>
                               <MapPin size={14} className="text-orange-500 shrink-0"/> {info.diaChi || 'Chưa có địa chỉ'}
                            </span>
                         </div>
                      </td>

                      {/* Trạng thái hồ sơ */}
                      <td className="p-4">
                        {latestRecord ? (
                          <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 max-w-[280px]">
                             <div className="flex justify-between items-center mb-1">
                                <div className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                                  <FileText size={12}/> Hồ sơ #{latestRecord.maHoSo}
                                </div>
                                <span className="text-[10px] text-gray-400">
                                  {new Date(latestRecord.ngayLapHoSo).toLocaleDateString('vi-VN')}
                                </span>
                             </div>
                             <div className="text-sm font-medium text-gray-800 truncate" title={latestRecord.chanDoan}>
                               {latestRecord.chanDoan}
                             </div>
                             <div className="text-xs text-gray-500 italic mt-0.5 truncate">
                               "{latestRecord.trangThaiHienTai || 'Đang điều trị'}"
                             </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Chưa có hồ sơ
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientList;