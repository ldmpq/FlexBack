import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, MessageCircle, Send, PlayCircle, Clock, Activity, Dumbbell, List, Star } from 'lucide-react';
import axiosClient from '../utils/axiosClient';

const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axiosClient.get(`/baocao/${id}`);
        
        let finalData = null;
        if (res.data && res.data.maBaoCao) {
            finalData = res.data;
        } else if (res.data && res.data.data) {
            finalData = res.data.data;
        }
        setReport(finalData);
      } catch (error) {
        console.error("Lỗi lấy chi tiết:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) return alert("Vui lòng nhập nội dung phản hồi!");

    const maHoSo = report?.KeHoachDieuTri?.LoTrinhDieuTri?.MucTieuDieuTri?.HoSoBenhAn?.maHoSo;
    
    if(!maHoSo) return alert("Lỗi dữ liệu: Không tìm thấy hồ sơ bệnh án!");

    setSubmitting(true);
    try {
      await axiosClient.post('/baocao/feedback', {
        maHoSo: maHoSo,
        chiTiet: `[Phản hồi Báo cáo #${report.maBaoCao}]: ${feedback}`,
        thangDiem: score ? parseFloat(score) : null
      });
      alert("Đã gửi phản hồi thành công!");
      setFeedback("");
      setScore("");
    } catch (error) {
      alert("Lỗi khi gửi phản hồi.");
    } finally {
      setSubmitting(false);
    }
  };

  const getPatientName = () => {
    return report?.KeHoachDieuTri?.LoTrinhDieuTri?.MucTieuDieuTri?.HoSoBenhAn?.BenhNhan?.TaiKhoan?.hoVaTen || 'Đang tải...';
  };

  const getPlanInfo = () => {
    const tenLoTrinh = report?.KeHoachDieuTri?.LoTrinhDieuTri?.tenLoTrinh;
    const tenKeHoach = report?.KeHoachDieuTri?.tenKeHoach;
    return tenLoTrinh || tenKeHoach || 'Không xác định';
  };

  // Lấy danh sách bài tập từ dữ liệu API
  const exercises = report?.KeHoachDieuTri?.ChiTietKeHoach || [];

  if (loading) return <div className="p-10 text-center text-gray-500">Đang tải chi tiết...</div>;
  if (!report) return <div className="p-10 text-center text-red-500">Không tìm thấy báo cáo!</div>;

  return (
    <div className="max-w-6xl mx-auto pb-10 animate-in slide-in-from-bottom-4 space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-medium">
        <ArrowLeft size={18} /> Quay lại danh sách
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* === CỘT TRÁI (LỚN) === */}
        <div className="lg:col-span-2 space-y-6">
            {/* 1. Thông tin chung */}
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

            {/* 2. Danh sách bài tập*/}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <List size={20} className="text-blue-600"/> Danh sách bài tập
                </h3>
                
                {exercises.length > 0 ? (
                  <div className="space-y-3">
                    {exercises.map((item: any, index: number) => (
                      <div key={index} className="flex items-center p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                        {/* Icon hoặc Ảnh bài tập */}
                        <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 mr-4 shrink-0">
                           {item.BaiTapPhucHoi?.hinhAnhMinhHoa ? (
                             <img src={item.BaiTapPhucHoi.hinhAnhMinhHoa} alt="" className="w-full h-full object-cover rounded-lg"/>
                           ) : (
                             <Dumbbell size={20} />
                           )}
                        </div>
                        
                        {/* Thông tin bài tập */}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm">
                            {item.BaiTapPhucHoi?.tenBaiTap || 'Bài tập không tên'}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                             {item.sets && <span className="bg-gray-100 px-2 py-0.5 rounded">Sets: {item.sets}</span>}
                             {item.reps && <span className="bg-gray-100 px-2 py-0.5 rounded">Reps: {item.reps}</span>}
                             {item.cuongDo && <span className="text-orange-600 font-medium">Cường độ: {item.cuongDo}</span>}
                          </div>
                        </div>

                        {/* Ghi chú riêng của bài (nếu có) */}
                        {item.ghiChu && (
                          <div className="text-xs text-gray-400 italic max-w-[150px] text-right truncate">
                            {item.ghiChu}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400 italic text-sm">
                    Không có danh sách bài tập chi tiết.
                  </div>
                )}
            </div>
        </div>

        {/* === CỘT PHẢI (NHỎ) === */}
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center">
                <div className="text-sm font-bold text-gray-500 mb-2">MỨC ĐỘ ĐAU</div>
                <div className={`text-4xl font-black mb-2 ${report.mucDoDau >= 7 ? 'text-red-500' : report.mucDoDau >= 4 ? 'text-orange-500' : 'text-green-500'}`}>
                    {report.mucDoDau}<span className="text-xl text-gray-300">/10</span>
                </div>
                <div className="text-xs text-gray-400">Chỉ số do bệnh nhân tự đánh giá</div>
                
                <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-2 text-left">
                     <div>
                        <div className="text-xs text-gray-400">ID Báo cáo</div>
                        <div className="font-semibold text-gray-700 text-sm">#{report.maBaoCao}</div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <MessageCircle size={18} className="text-blue-600"/> Gửi phản hồi
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                    Phản hồi này sẽ được lưu vào <strong>Đánh giá tiến triển</strong> của hồ sơ bệnh án.
                </p>

                <div className="mb-3">
                    <label className="text-xs font-bold text-gray-600 mb-1 flex items-center gap-1">
                        <Star size={12} className="text-yellow-500 fill-yellow-500"/> Chấm điểm tiến triển (0-10)
                    </label>
                    <input 
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        placeholder="VD: 8.5"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-100 text-sm font-medium"
                    />
                </div>
                
                <textarea 
                    className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 min-h-[120px] text-sm mb-3 resize-none"
                    placeholder="Nhập lời khuyên, nhận xét..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                />
                
                <button 
                    onClick={handleSubmitFeedback}
                    disabled={submitting || !feedback.trim()}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? (
                       <> <Activity className="animate-spin" size={16}/> Đang gửi...</>
                    ) : (
                       <> <Send size={16} /> Gửi đánh giá </>
                    )}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;