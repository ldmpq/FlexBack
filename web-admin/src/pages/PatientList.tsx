import { useState, useEffect } from 'react';
import { Eye, Phone, Calendar, Activity, MapPin, FileText, CalendarCheck} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import SearchBar from '../components/SearchBar';

const PatientList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Lấy thông tin người dùng hiện tại để hiển thị lời chào
  const currentUser = JSON.parse(localStorage.getItem('user_info') || '{}');

  useEffect(() => {
    const fetchAssignedPatients = async () => {
      try {
        // Gọi API lấy danh sách bệnh nhân được phân công
        const res = await axiosClient.get('/benhnhan/assigned'); 
        
        // Xử lý dữ liệu trả về an toàn (đề phòng API trả về cấu trúc khác nhau)
        if (res.data && Array.isArray(res.data.data)) {
            setPatients(res.data.data);
        } else if (Array.isArray(res.data)) {
            setPatients(res.data);
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

  // Logic lọc tìm kiếm (theo tên hoặc số điện thoại)
  const filteredPatients = patients.filter((p: any) => {
    const info = p.TaiKhoan || {}; // Thông tin nằm trong bảng TaiKhoan
    const name = (info.hoVaTen || p.hoVaTen || '').toLowerCase();
    const phone = (info.soDienThoai || p.soDienThoai || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    return name.includes(search) || phone.includes(search);
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* --- HEADER --- */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <CalendarCheck className="text-blue-600" /> Danh sách Phân công
          </h2>
          <p className="text-gray-500 mt-1">
            Xin chào <strong>{currentUser.hoVaTen}</strong>, đây là danh sách bệnh nhân bạn đang phụ trách điều trị.
          </p>
        </div>
      </div>

      <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Tìm theo tên hoặc số điện thoại..." />

      {/* --- DANH SÁCH BỆNH NHÂN --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <Activity className="animate-spin text-blue-500 mb-2" size={24}/>
            Đang tải dữ liệu...
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="p-12 text-center text-gray-500 bg-gray-50">
             {searchTerm ? 'Không tìm thấy kết quả phù hợp.' : 'Hiện tại bạn chưa được phân công bệnh nhân nào.'}
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium text-sm">
              <tr>
                <th className="p-4 w-20">ID</th>
                <th className="p-4">Họ và Tên</th>
                <th className="p-4">Liên hệ</th>
                <th className="p-4">Hồ sơ mới nhất</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPatients.map((p) => {
                const latestRecord = p.HoSoBenhAn?.[0];
                const info = p.TaiKhoan || {};

                return (
                  <tr key={p.maBenhNhan} className="hover:bg-blue-50/50 transition-colors group">
                    {/* ID */}
                    <td className="p-4 font-mono text-gray-500 text-sm">#{p.maBenhNhan}</td>
                    
                    {/* Tên & Thông tin cơ bản */}
                    <td className="p-4">
                      <div className="font-semibold text-gray-800 text-base">
                        {info.hoVaTen || 'Chưa cập nhật tên'}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                         <Calendar size={12}/> {info.ngaySinh ? new Date(info.ngaySinh).toLocaleDateString('vi-VN') : 'N/A'} - {info.gioiTinh}
                      </div>
                    </td>

                    {/* Liên hệ & Địa chỉ */}
                    <td className="p-4">
                       <div className="flex flex-col gap-1 text-sm text-gray-600">
                          <span className="flex items-center gap-2">
                             <Phone size={14} className="text-green-600"/> {info.soDienThoai || '---'}
                          </span>
                          <span className="flex items-center gap-2 truncate max-w-[200px]" title={info.diaChi}>
                             <MapPin size={14} className="text-orange-500"/> {info.diaChi || '---'}
                          </span>
                       </div>
                    </td>

                    {/* Trạng thái hồ sơ */}
                    <td className="p-4">
                      {latestRecord ? (
                        <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 max-w-[250px]">
                           <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                             <FileText size={12}/> {new Date(latestRecord.ngayLapHoSo).toLocaleDateString('vi-VN')}
                           </div>
                           <div className="text-sm font-medium text-blue-700 truncate" title={latestRecord.chanDoan}>
                             {latestRecord.chanDoan}
                           </div>
                           <div className="text-xs text-gray-500 italic mt-0.5 truncate">
                             {latestRecord.trangThaiHienTai || 'Đang điều trị'}
                           </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm italic bg-gray-50 px-2 py-1 rounded border border-gray-100">
                          Chưa có hồ sơ
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PatientList;