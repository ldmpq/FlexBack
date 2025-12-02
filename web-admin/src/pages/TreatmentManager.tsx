import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { FileText, Target, Map, Calendar, ChevronRight, ChevronDown, Plus, User, X, CheckCircle, Clock, Users, Stethoscope } from 'lucide-react';

interface TaiKhoan { hoVaTen: string; }
interface HoSo {
  maHoSo: number;
  ngayLapHoSo: string;
  chanDoan: string;
  BenhNhan?: { TaiKhoan: TaiKhoan }; 
  MucTieuDieuTri?: MucTieu[];
}

interface MucTieu {
  maMucTieu: number;
  noiDung: string;
  mucDoUuTien: string; 
  ngayDatMucTieu: string;
  LoTrinhDieuTri?: LoTrinh[];
}

interface KyThuatVien {
    TaiKhoan: TaiKhoan;
}

interface LoTrinh {
  maLoTrinh: number;
  tenLoTrinh: string;
  thoiGianBatDau: string;
  thoiGianKetThuc: string;
  ghiChu: string;
  KyThuatVien?: KyThuatVien; 
}

interface KTVOption {
  maKyThuatVien: number; 
  TaiKhoan: TaiKhoan;
}

const TreatmentManager: React.FC = () => {
  const [listHoSo, setListHoSo] = useState<HoSo[]>([]);
  const [selectedHoSo, setSelectedHoSo] = useState<HoSo | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedMucTieu, setExpandedMucTieu] = useState<number | null>(null);

  // --- STATE MODAL & FORM ---
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [listKTV, setListKTV] = useState<KTVOption[]>([]); 
  const [submitting, setSubmitting] = useState(false);
  
  const [targetMucTieuId, setTargetMucTieuId] = useState<number | null>(null);

  // Form Mục tiêu
  const [goalForm, setGoalForm] = useState({
    noiDung: '',
    mucDoUuTien: 'BinhThuong',
    ngayDatMucTieu: new Date().toISOString().split('T')[0]
  });

  // Form Lộ trình
  const [routeForm, setRouteForm] = useState({
    tenLoTrinh: '',
    maKyThuatVien: '', 
    thoiGianBatDau: new Date().toISOString().split('T')[0],
    thoiGianKetThuc: '',
    ghiChu: ''
  });

  // --- 1. LOAD DANH SÁCH HỒ SƠ (Đã sửa logic trích xuất) ---
  useEffect(() => {
    const fetchList = async () => {
      try {
        setLoading(true);
        const res: any = await axiosClient.get('/users/benh-nhan');
        const patients = res.data.data || res.data;
        
        // --- BƯỚC DEBUG QUAN TRỌNG: SỬ DỤNG F12 ĐỂ XEM TÊN TRƯỜNG ĐÚNG ---
        console.log("--- DEBUG RAW DATA: Kiểm tra tên quan hệ ---");
        console.log(patients); 
        // Sau khi chạy code này, bạn mở Console (F12) và xem trong object patients
        // Bệnh nhân có trường BenhNhan hay benhNhan?
        // Bên trong chi tiết BenhNhan, mảng Hồ sơ tên là gì? (HOSOSO_BENHAN hay HoSoBenhAn?)
        // -----------------------------------------------------------------

        const allHoSo: HoSo[] = [];
        patients.forEach((p: any) => {
          // Lấy chi tiết BenhNhan
          const benhNhanData = p.BenhNhan || p.benhNhan; 
          
          if (benhNhanData) {
            const benhNhanDetail = Array.isArray(benhNhanData) ? benhNhanData[0] : benhNhanData;
            
            if (benhNhanDetail) {
              // --- LOGIC TRÍCH XUẤT LINH HOẠT ---
              // SỬA TÊN BIẾN listHoSo NẾU KHÔNG KHỚP VỚI CÁC TÊN DƯỚI ĐÂY!
              const listHoSo = benhNhanDetail.HOSOSO_BENHAN || benhNhanDetail.HoSoBenhAn || []; 
              
              listHoSo.forEach((hs: any) => {
                allHoSo.push({ 
                  ...hs, 
                  BENHNHAN: { TaiKhoan: { hoVaTen: p.hoVaTen } } 
                });
              });
            }
          }
        });
        
        setListHoSo(allHoSo);
        if (allHoSo.length > 0) handleSelectHoSo(allHoSo[0].maHoSo);
        console.log("Danh sách Hồ sơ đã trích xuất:", allHoSo);
      } catch (error) {
        console.error("Lỗi tải danh sách hồ sơ:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, []);

  // --- 2. LOAD CHI TIẾT CÂY LỘ TRÌNH (Bao gồm Mục tiêu) ---
  const handleSelectHoSo = async (maHoSo: number) => {
    try {
      const res: any = await axiosClient.get(`/treatment/${maHoSo}`);
      const data = res.data.data || res.data;
      setSelectedHoSo(data);
      setExpandedMucTieu(null);
      console.log(`Dữ liệu chi tiết Hồ sơ #${maHoSo} sau khi tải lại:`, data);
    } catch (error) {
      console.error("Lỗi tải chi tiết lộ trình:", error);
      setSelectedHoSo(null);
    }
  };

  // --- LOAD KTV CHO MODAL LỘ TRÌNH ---
  const fetchKTV = async () => {
    try {
        const res: any = await axiosClient.get('/hoso/ky-thuat-vien'); 
        setListKTV(res.data.data || res.data);
    } catch (error) {
        console.error("Lỗi lấy danh sách KTV:", error);
    }
  };

  // --- 3. XỬ LÝ THÊM MỤC TIÊU ---
  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHoSo) return;

    try {
      setSubmitting(true);
      await axiosClient.post('/treatment/muctieu', {
        maHoSo: selectedHoSo.maHoSo,
        ...goalForm
      });
      
      alert("Thêm mục tiêu thành công! Đang tải lại dữ liệu...");
      setShowGoalModal(false);
      setGoalForm({ noiDung: '', mucDoUuTien: 'BinhThuong', ngayDatMucTieu: new Date().toISOString().split('T')[0] });
      await handleSelectHoSo(selectedHoSo.maHoSo);
    } catch (error) {
      alert("Lỗi khi thêm mục tiêu. Vui lòng kiểm tra Console (F12) để xem chi tiết lỗi API.");
      console.error("Lỗi API Mục tiêu:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // --- 4. XỬ LÝ THÊM LỘ TRÌNH ---
  const handleAddRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetMucTieuId) return;

    try {
      setSubmitting(true);
      
      await axiosClient.post('/treatment/lotrinh', {
        maMucTieu: targetMucTieuId,
        ...routeForm
      });

      alert("Thêm lộ trình thành công! Đang tải lại dữ liệu...");
      setShowRouteModal(false);
      setRouteForm({ 
        tenLoTrinh: '', 
        maKyThuatVien: '',
        thoiGianBatDau: new Date().toISOString().split('T')[0], 
        thoiGianKetThuc: '', 
        ghiChu: '' 
      });
      await handleSelectHoSo(selectedHoSo!.maHoSo);
      setExpandedMucTieu(targetMucTieuId);
    } catch (error) {
      alert("Lỗi khi thêm lộ trình. Vui lòng kiểm tra Console (F12) để xem chi tiết lỗi API.");
      console.error("Lỗi API Lộ trình:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleMucTieu = (id: number) => {
    setExpandedMucTieu(expandedMucTieu === id ? null : id);
  };
  
  // Hàm xác định màu cho mức độ ưu tiên
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'Cao':
        return 'bg-red-100 text-red-700';
      case 'Thap':
        return 'bg-green-100 text-green-700';
      case 'BinhThuong':
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col font-sans text-gray-800">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Map className="text-blue-600"/> Quản lý Hồ sơ & Lộ trình
      </h2>

      <div className="flex gap-6 flex-1 overflow-hidden">
        {/* CỘT TRÁI: DANH SÁCH HỒ SƠ */}
        <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <div className="p-4 border-b bg-gray-50 font-semibold text-gray-700 bg-gray-50 rounded-t-xl">
            Danh sách Hồ sơ ({listHoSo.length})
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {listHoSo.map(hs => (
              <div 
                key={hs.maHoSo}
                onClick={() => handleSelectHoSo(hs.maHoSo)}
                className={`p-4 rounded-lg cursor-pointer transition border ${
                  selectedHoSo?.maHoSo === hs.maHoSo 
                    ? 'bg-blue-50 border-blue-500 shadow-sm ring-1 ring-blue-200' 
                    : 'bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-blue-700">Hồ sơ #{hs.maHoSo}</span>
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border shadow-sm">
                    {new Date(hs.ngayLapHoSo).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 font-medium mb-1">
                  <User size={14} className="text-gray-400"/> {hs.BenhNhan?.TaiKhoan.hoVaTen}
                </div>
                <p className="text-xs text-gray-500 line-clamp-1 italic">{hs.chanDoan}</p>
              </div>
            ))}
            {listHoSo.length === 0 && !loading && (
              <p className="text-center text-gray-400 p-8 border-2 border-dashed m-4 rounded">Chưa có hồ sơ nào.</p>
            )}
          </div>
        </div>

        {/* CỘT PHẢI: CHI TIẾT LỘ TRÌNH (TREE VIEW) */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col relative overflow-hidden">
          {selectedHoSo ? (
            <>
              <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-xl flex justify-between items-center shadow-md z-10">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <FileText size={20}/> Lộ trình: {selectedHoSo.BenhNhan?.TaiKhoan.hoVaTen}
                  </h3>
                  <p className="text-blue-100 text-sm opacity-90 mt-1 pl-7">Chẩn đoán: {selectedHoSo.chanDoan}</p>
                </div>
                <button 
                  onClick={() => setShowGoalModal(true)} 
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-50 transition shadow-sm hover:shadow active:scale-95"
                >
                  <Plus size={16}/> Thêm Mục tiêu
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                {selectedHoSo.MucTieuDieuTri && selectedHoSo.MucTieuDieuTri.length > 0 ? (
                  <div className="space-y-4">
                    {selectedHoSo.MucTieuDieuTri.map((mt) => (
                      <div key={mt.maMucTieu} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        {/* Header Mục tiêu */}
                        <div 
                          className="p-4 flex items-center justify-between cursor-pointer hover:bg-blue-50/50 transition border-l-4 border-l-blue-500"
                          onClick={() => toggleMucTieu(mt.maMucTieu)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                                <Target size={20} />
                            </div>
                            <div>
                              <div className="font-bold text-gray-800 text-lg">{mt.noiDung}</div>
                              <div className="text-xs text-gray-500 flex gap-3 mt-1 items-center">
                                <span className="flex items-center gap-1"><Calendar size={12}/> Đặt ngày: {new Date(mt.ngayDatMucTieu).toLocaleDateString('vi-VN')}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getPriorityStyle(mt.mucDoUuTien)}`}>
                                  {mt.mucDoUuTien}
                                </span>
                              </div>
                            </div>
                          </div>
                          {expandedMucTieu === mt.maMucTieu ? <ChevronDown size={20} className="text-gray-400"/> : <ChevronRight size={20} className="text-gray-400"/>}
                        </div>

                        {/* Danh sách Lộ trình bên trong Mục tiêu */}
                        {expandedMucTieu === mt.maMucTieu && (
                          <div className="bg-gray-50 p-5 border-t border-gray-100 animate-in slide-in-from-top-2 duration-300">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <Map size={14}/> Các giai đoạn lộ trình
                              </h4>
                              <button 
                                onClick={() => { setTargetMucTieuId(mt.maMucTieu); setShowRouteModal(true); fetchKTV(); }} // Thêm fetchKTV()
                                className="text-blue-600 text-sm font-semibold hover:text-blue-800 flex items-center gap-1 hover:underline"
                              >
                                <Plus size={14}/> Thêm Giai đoạn
                              </button>
                            </div>
                            
                            {mt.LoTrinhDieuTri && mt.LoTrinhDieuTri.length > 0 ? (
                              <div className="space-y-3 pl-2 border-l-2 border-dashed border-gray-300 ml-2.5">
                                {mt.LoTrinhDieuTri.map(lt => (
                                  <div key={lt.maLoTrinh} className="bg-white p-4 rounded-lg border border-gray-200 relative group hover:border-blue-300 transition-all ml-4 shadow-sm">
                                    <div className="absolute -left-[26px] top-1/2 -translate-y-1/2 w-4 h-0.5 bg-gray-300"></div>
                                    <div className="absolute -left-[30px] top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full border border-white"></div>
                                    
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="font-bold text-gray-800 text-base">{lt.tenLoTrinh}</div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                                                <Clock size={12}/> 
                                                <span className="font-medium text-gray-700">
                                                    {new Date(lt.thoiGianBatDau).toLocaleDateString('vi-VN')}
                                                </span>
                                                <span>➔</span>
                                                <span className="font-medium text-gray-700">
                                                    {new Date(lt.thoiGianKetThuc).toLocaleDateString('vi-VN')}
                                                </span>
                                            </div>
                                            {/* Hiển thị KTV phụ trách */}
                                            {lt.KyThuatVien && (
                                                <div className='flex items-center gap-1.5 text-xs text-gray-600 mt-2'>
                                                    <Stethoscope size={14} className='text-green-500'/>
                                                    KTV: <span className='font-semibold'>{lt.KyThuatVien.TaiKhoan.hoVaTen}</span>
                                                </div>
                                            )}
                                        </div>
                                        <button className="text-xs font-medium border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-50 hover:text-blue-600 transition">
                                            Chi tiết & Bài tập
                                        </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center text-sm text-gray-400 py-6 border-2 border-dashed border-gray-200 rounded-lg bg-white/50">
                                Chưa có lộ trình nào. Hãy thêm lộ trình đầu tiên!
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <Target size={64} className="mb-4 opacity-20"/>
                    <p className="text-lg font-medium text-gray-500">Chưa thiết lập mục tiêu</p>
                    <button 
                        onClick={() => setShowGoalModal(true)} 
                        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-xl active:scale-95"
                    >
                      + Tạo Mục Tiêu Mới
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 italic bg-gray-50">
              <FileText size={64} className="mb-4 opacity-10 text-blue-500"/>
              <p className="text-lg">Vui lòng chọn một hồ sơ bên trái để xem chi tiết.</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: THÊM MỤC TIÊU */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg flex items-center gap-2"><Target size={20}/> Thêm Mục Tiêu Mới</h3>
              <button onClick={() => setShowGoalModal(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleAddGoal} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Nội dung mục tiêu <span className="text-red-500">*</span></label>
                <textarea required className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" rows={3}
                  placeholder="VD: Cải thiện biên độ vận động khớp gối..."
                  value={goalForm.noiDung} onChange={e => setGoalForm({...goalForm, noiDung: e.target.value})} />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Mức độ Ưu tiên <span className="text-red-500">*</span></label>
                <select required className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={goalForm.mucDoUuTien} onChange={e => setGoalForm({...goalForm, mucDoUuTien: e.target.value})}
                >
                    <option value="BinhThuong">Bình thường (Vàng)</option>
                    <option value="Cao">Cao (Đỏ)</option>
                    <option value="Thap">Thấp (Xanh lá)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Ngày đặt mục tiêu</label>
                <input type="date" required className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={goalForm.ngayDatMucTieu} onChange={e => setGoalForm({...goalForm, ngayDatMucTieu: e.target.value})} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowGoalModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-100">Hủy</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  {submitting ? 'Đang lưu...' : <><CheckCircle size={16}/> Lưu mục tiêu</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: THÊM LỘ TRÌNH */}
      {showRouteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg flex items-center gap-2"><Map size={20}/> Thêm Giai Đoạn Lộ Trình</h3>
              <button onClick={() => setShowRouteModal(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleAddRoute} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Tên giai đoạn <span className="text-red-500">*</span></label>
                <input required type="text" className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: Giai đoạn 1 - Giảm đau"
                  value={routeForm.tenLoTrinh} onChange={e => setRouteForm({...routeForm, tenLoTrinh: e.target.value})} />
              </div>

              {/* THÊM: Chọn Kỹ thuật viên cho Lộ trình */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Kỹ thuật viên PHCN</label>
                <select className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={routeForm.maKyThuatVien} onChange={e => setRouteForm({...routeForm, maKyThuatVien: e.target.value})}
                >
                  <option value="">-- Chưa phân công --</option>
                  {listKTV.map((ktv: any) => (
                    <option key={ktv.maKyThuatVien} value={ktv.maKyThuatVien}>
                      KTV. {ktv.TaiKhoan?.hoVaTen}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Ngày bắt đầu</label>
                  <input type="date" required className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    value={routeForm.thoiGianBatDau} onChange={e => setRouteForm({...routeForm, thoiGianBatDau: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Ngày kết thúc</label>
                  <input type="date" required className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    value={routeForm.thoiGianKetThuc} onChange={e => setRouteForm({...routeForm, thoiGianKetThuc: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Ghi chú</label>
                <textarea className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" rows={2}
                  placeholder="Lưu ý cho giai đoạn này..."
                  value={routeForm.ghiChu} onChange={e => setRouteForm({...routeForm, ghiChu: e.target.value})} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowRouteModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-100">Hủy</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  {submitting ? 'Đang lưu...' : <><CheckCircle size={16}/> Lưu lộ trình</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreatmentManager;