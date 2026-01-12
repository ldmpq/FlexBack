import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, MessageCircle, Send, Clock, Activity, Dumbbell, List, CheckCircle, XCircle, Star, ShieldAlert } from 'lucide-react';
import axiosClient from '../utils/axiosClient';

const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // State cho phản hồi BÁC SĨ
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState('');
  
  // State cho đánh giá KTV
  const [ktvResult, setKtvResult] = useState<boolean | null>(true); 
  const [ktvNote, setKtvNote] = useState('');
  
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [reportRes, meRes] = await Promise.all([
            axiosClient.get(`/baocao/${id}`),
            axiosClient.get('/auth/me')
        ]);
        let finalData = null;
        if (reportRes.data && reportRes.data.maBaoCao) {
            finalData = reportRes.data;
        } else if (reportRes.data && reportRes.data.data) {
            finalData = reportRes.data.data;
        }
        setReport(finalData);
        const userData = meRes.data.data || meRes.data;
        setCurrentUser(userData);

      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const getMaHoSo = () => {
    return report?.KeHoachDieuTri?.LoTrinhDieuTri?.MucTieuDieuTri?.HoSoBenhAn?.maHoSo;
  }

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) return alert("Vui lòng nhập nội dung phản hồi!");

    const maHoSo = getMaHoSo();
    if(!maHoSo) return alert("Lỗi dữ liệu: Không tìm thấy hồ sơ bệnh án!");

    setSubmitting(true);
    try {
      await axiosClient.post('/baocao/feedback', {
        maHoSo: maHoSo,
        chiTiet: `[Bác sĩ phản hồi #${report.maBaoCao}]: ${feedback}`,
        thangDiem: score ? parseFloat(score) : null
      });
      alert("Đã gửi phản hồi chuyên môn thành công!");
      setFeedback("");
      setScore("");
    } catch (error) {
      alert("Lỗi khi gửi phản hồi.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleKTVSubmit = async () => {
    if (ktvResult === null) return alert("Vui lòng chọn kết quả đánh giá!");
    if (!ktvNote.trim()) return alert("Vui lòng nhập nhận xét của KTV!");

    const maHoSo = getMaHoSo();
    if(!maHoSo) return alert("Lỗi dữ liệu: Không tìm thấy hồ sơ bệnh án!");

    setSubmitting(true);
    try {
      await axiosClient.post('/baocao/ktv-evaluate', {
        maHoSo: maHoSo,
        ketQua: ktvResult,
        nhanXet: `[KTV đánh giá #${report.maBaoCao}]: ${ktvNote}`
      });
      alert("KTV đã gửi đánh giá thành công!");
      setKtvNote("");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Lỗi khi gửi đánh giá KTV.";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  }

  const getPatientName = () => {
    return report?.KeHoachDieuTri?.LoTrinhDieuTri?.MucTieuDieuTri?.HoSoBenhAn?.BenhNhan?.TaiKhoan?.hoVaTen || 'Đang tải...';
  };

  const getPlanInfo = () => {
    const tenLoTrinh = report?.KeHoachDieuTri?.LoTrinhDieuTri?.tenLoTrinh;
    const tenKeHoach = report?.KeHoachDieuTri?.tenKeHoach;
    return tenLoTrinh || tenKeHoach || 'Không xác định';
  };

  const exercises = report?.KeHoachDieuTri?.ChiTietKeHoach || [];

  const isKTV = currentUser?.loaiTaiKhoan === 'KY_THUAT_VIEN';
  const isBacSi = currentUser?.loaiTaiKhoan === 'BAC_SI';

  if (loading) return <div className="p-10 text-center text-gray-500">Đang tải chi tiết...</div>;
  if (!report) return <div className="p-10 text-center text-red-500">Không tìm thấy báo cáo!</div>;

  return (
    <div className="max-w-6xl mx-auto pb-10 animate-in slide-in-from-bottom-4 space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-medium">
        <ArrowLeft size={18} /> Quay lại danh sách
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* === CỘT TRÁI: THÔNG TIN CHI TIẾT === */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h1 className="text-xl font-bold text-gray-800 mb-2">
                    {getPlanInfo()}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><User size={14} className="text-blue-500"/> {getPatientName()}</span>
                    <span className="flex items-center gap-1"><Calendar size={14} className="text-orange-500"/> {new Date(report.ngayTao || report.ngayLuyenTap).toLocaleString('vi-VN')}</span>
                    <span className="flex items-center gap-1"><Clock size={14} className="text-green-500"/> {report.thoiLuong} phút</span>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="text-xs font-bold text-gray-400 uppercase mb-2">Đánh giá sơ bộ từ bệnh nhân</div>
                    <p className="text-gray-700 italic">"{report.danhGiaSoBo || 'Không có ghi chú'}"</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <List size={20} className="text-blue-600"/> Danh sách bài tập đã tập
                </h3>
                {exercises.length > 0 ? (
                  <div className="space-y-3">
                    {exercises.map((item: any, index: number) => (
                      <div key={index} className="flex items-center p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                        <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 mr-4 shrink-0">
                           {item.BaiTapPhucHoi?.hinhAnhMinhHoa ? (
                             <img src={item.BaiTapPhucHoi.hinhAnhMinhHoa} alt="" className="w-full h-full object-cover rounded-lg"/>
                           ) : (
                             <Dumbbell size={20} />
                           )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm">
                            {item.BaiTapPhucHoi?.tenBaiTap || 'Bài tập không tên'}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                             {item.sets && <span className="bg-gray-100 px-2 py-0.5 rounded">Sets: {item.sets}</span>}
                             {item.reps && <span className="bg-gray-100 px-2 py-0.5 rounded">Reps: {item.reps}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400 italic text-sm">Không có bài tập chi tiết.</div>
                )}
            </div>
        </div>

        {/* === CỘT PHẢI: FORM ĐÁNH GIÁ (PHÂN QUYỀN) === */}
        <div className="space-y-6">
            
            {/* 1. MỨC ĐỘ ĐAU*/}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center">
                <div className="text-sm font-bold text-gray-500 mb-2">MỨC ĐỘ ĐAU</div>
                <div className={`text-4xl font-black mb-2 ${report.mucDoDau >= 7 ? 'text-red-500' : report.mucDoDau >= 4 ? 'text-orange-500' : 'text-green-500'}`}>
                    {report.mucDoDau}<span className="text-xl text-gray-300">/10</span>
                </div>
                <div className="text-xs text-gray-400">Chỉ số do bệnh nhân tự đánh giá</div>
            </div>

            {/* 2. KHU VỰC CỦA KỸ THUẬT VIÊN */}
            {isKTV && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-200 ring-4 ring-blue-50 animate-in fade-in zoom-in duration-300">
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Activity size={18} className="text-blue-600"/> Đánh giá KTV
                    </h3>
                    <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-700 mb-4 flex gap-2">
                        <ShieldAlert size={16} /> Khu vực dành riêng cho Kỹ thuật viên
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <button
                            onClick={() => setKtvResult(true)}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                                ktvResult === true 
                                ? 'bg-green-50 border-green-500 text-green-700 shadow-sm scale-105' 
                                : 'border-gray-200 hover:bg-gray-50 text-gray-400'
                            }`}
                        >
                            <CheckCircle size={24} className={ktvResult === true ? 'fill-green-200' : ''} />
                            <span className="text-sm font-bold mt-1">Đạt</span>
                        </button>

                        <button
                            onClick={() => setKtvResult(false)}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                                ktvResult === false 
                                ? 'bg-red-50 border-red-500 text-red-700 shadow-sm scale-105' 
                                : 'border-gray-200 hover:bg-gray-50 text-gray-400'
                            }`}
                        >
                            <XCircle size={24} className={ktvResult === false ? 'fill-red-200' : ''} />
                            <span className="text-sm font-bold mt-1">Không đạt</span>
                        </button>
                    </div>

                    <textarea 
                        className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 min-h-[100px] text-sm mb-3 resize-none"
                        placeholder="Nhận xét chi tiết của KTV..."
                        value={ktvNote}
                        onChange={(e) => setKtvNote(e.target.value)}
                    />

                    <button 
                        onClick={handleKTVSubmit}
                        disabled={submitting || !ktvNote.trim()}
                        className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {submitting ? <Activity className="animate-spin" size={16}/> : <Send size={16} />} 
                        Gửi kết quả
                    </button>
                </div>
            )}

            {/* 3. KHU VỰC CỦA BÁC SĨ (HOẶC ADMIN) */}
            {isBacSi && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-200 ring-4 ring-orange-50 animate-in fade-in zoom-in duration-300">
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <MessageCircle size={18} className="text-orange-600"/> Phản hồi Bác sĩ
                    </h3>
                    <div className="p-3 bg-orange-50 rounded-lg text-xs text-orange-700 mb-4 flex gap-2">
                        <ShieldAlert size={16} /> Khu vực dành riêng cho Bác sĩ
                    </div>
                    
                    <div className="mb-4">
                        <label className="text-xs font-bold text-gray-600 mb-1 flex items-center gap-1">
                            <Star size={12} className="text-yellow-500 fill-yellow-500"/> Chấm điểm tiến triển (0-10)
                        </label>
                        <input 
                            type="number"
                            min="0" max="10" step="0.1"
                            placeholder="VD: 8.5"
                            value={score}
                            onChange={(e) => setScore(e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-100 text-sm font-medium"
                        />
                    </div>
                    
                    <textarea 
                        className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-100 min-h-[120px] text-sm mb-3 resize-none"
                        placeholder="Nhập lời khuyên chuyên môn, chỉ định tiếp theo..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                    />
                    
                    <button 
                        onClick={handleSubmitFeedback}
                        disabled={submitting || !feedback.trim()}
                        className="w-full bg-orange-600 text-white py-2.5 rounded-lg font-semibold hover:bg-orange-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                         {submitting ? <Activity className="animate-spin" size={16}/> : <Send size={16} />} 
                        Gửi phản hồi
                    </button>
                </div>
            )}

            {/* Thông báo nếu không có quyền */}
            {!isKTV && !isBacSi && (
                <div className="p-4 bg-gray-100 rounded-xl text-center text-gray-400 text-xs italic">
                    Bạn đang xem với vai trò người xem (View Only)
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;