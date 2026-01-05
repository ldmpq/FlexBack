import React, { useState } from 'react';
import { FileText, Target, Map, Calendar, ChevronRight, ChevronDown, Plus, User, Clock, Stethoscope, Dumbbell, Briefcase, ArrowUp, ArrowDown, Minus,Trash2} from 'lucide-react';
import { useTreatmentManager } from '../hooks/useTreatmentManager';
import type { LoTrinh } from '../types/treatment.type';
import ExerciseSetup from './ExerciseSetup';
import GoalForm from '../components/forms/GoalForm';
import TreatmentForm from '../components/forms/TreamentForm';
import DeleteConfirmModal from '../components/forms/DeleteConfirm';

const TreatmentManager: React.FC = () => {

  const {
    listHoSo, selectedHoSo, loading, expandedMucTieu, listKTV, submitting,
    setExpandedMucTieu, handleSelectHoSo, fetchKTV, createGoal, deleteGoal, createRoute, deleteRoute
  } = useTreatmentManager();

  // Navigation State
  const [viewMode, setViewMode] = useState<'MANAGER' | 'EXERCISE_SETUP'>('MANAGER');
  const [editingRoute, setEditingRoute] = useState<LoTrinh | null>(null);

  // Modal Control States
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [targetMucTieuId, setTargetMucTieuId] = useState<number | null>(null);

  const [deleteData, setDeleteData] = useState<{
    id: number;
    name: string;
    type: 'GOAL' | 'ROUTE';
  } | null>(null);

  // Handlers
  const handleOpenExerciseSetup = (route: LoTrinh) => {
    setEditingRoute(route);
    setViewMode('EXERCISE_SETUP');
  };

  const handleReloadData = () => {
    if (selectedHoSo) handleSelectHoSo(selectedHoSo.maHoSo);
  };

  // Wrapper xử lý thêm mục tiêu (nhận data từ GoalForm)
  const handleAddGoalWrapper = async (formData: any) => {
    const success = await createGoal(formData);
    if (success) {
      setShowGoalModal(false);
    }
  };

  // Wrapper xử lý thêm lộ trình (nhận data từ TreatmentForm)
  const handleAddRouteWrapper = async (formData: any) => {
    if (!targetMucTieuId) return;
    const success = await createRoute(formData, targetMucTieuId);
    if (success) {
      setShowRouteModal(false);
    }
  };

  // Hàm lấy thông tin hiển thị cho Mức độ ưu tiên
  const getRoutePriorityInfo = (priority?: string) => {
    if (!priority) {
      return { color: 'bg-orange-100 text-orange-700 border-orange-200', label: 'Trung bình', icon: <Minus size={12} /> };
    }
    const p = priority.toLowerCase().trim(); p
    if (p === 'cao' || p === 'high') {
      return { color: 'bg-red-100 text-red-700 border-red-200', label: 'Ưu tiên: Cao', icon: <ArrowUp size={12} /> };
    }
    if (p === 'thap' || p === 'low') {
      return { color: 'bg-green-100 text-green-700 border-green-200', label: 'Ưu tiên: Thấp', icon: <ArrowDown size={12} /> };
    }
    return { color: 'bg-orange-100 text-orange-700 border-orange-200', label: 'Trung bình', icon: <Minus size={12} /> };
  };

  const handleConfirmDelete = async () => {
    if (!deleteData) return;

    let success = false;

    // Kiểm tra type để gọi hàm xóa tương ứng
    if (deleteData.type === 'GOAL') {
      success = await deleteGoal(deleteData.id); // Hàm xóa mục tiêu
    } else {
      success = await deleteRoute(deleteData.id); // Hàm xóa lộ trình
    }

    if (success) {
      setDeleteData(null); // Đóng modal sau khi xóa thành công
    }
  };

  // --- RENDER CONDITIONAL ---
  if (viewMode === 'EXERCISE_SETUP' && editingRoute) {
    return <ExerciseSetup loTrinh={editingRoute} onBack={() => setViewMode('MANAGER')} onSave={handleReloadData} />;
  }

  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col font-sans text-gray-800">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Map className="text-blue-600" /> Quản lí Hồ sơ và Lộ trình
        </h2>
        <p className="text-gray-500 text-sm mt-1">Tạo lộ trình điều trị cho bệnh nhân</p>     
      </div>

      <div className="flex gap-6 flex-1 overflow-hidden">
        {/* CỘT TRÁI: DANH SÁCH */}
        <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <div className="p-4 border-b bg-gray-50 rounded-t-xl flex justify-between items-center">
            <span className="font-bold text-gray-700">Danh sách Hồ sơ</span>
            <span className="bg-blue text-blue-600 px-2.5 py-0.5 rounded-full text-xs font-bold border border-gray-200 shadow-sm">
              {listHoSo.length}
            </span>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {listHoSo.map(hs => (
              <div key={hs.maHoSo} onClick={() => handleSelectHoSo(hs.maHoSo)}
                className={`p-4 rounded-lg cursor-pointer transition border ${selectedHoSo?.maHoSo === hs.maHoSo ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-200' : 'bg-white border-gray-100 hover:bg-gray-50'}`}>
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-blue-700">Hồ sơ #{hs.maHoSo}</span>
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border shadow-sm">{new Date(hs.ngayLapHoSo).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 font-medium mb-1"><User size={14} className="text-gray-400" /> {hs.tenBenhNhan}</div>
                <p className="text-xs text-gray-500 line-clamp-1 italic">{hs.chanDoan}</p>
              </div>
            ))}
            {listHoSo.length === 0 && !loading && <p className="text-center text-gray-400 p-8 border-2 border-dashed m-4 rounded">Chưa có hồ sơ nào.</p>}
          </div>
        </div>

        {/* CỘT PHẢI: CHI TIẾT */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col relative overflow-hidden">
          {selectedHoSo ? (
            <>
              <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-xl flex justify-between items-center shadow-md z-10">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2"><FileText size={20} /> #{selectedHoSo.maHoSo} {selectedHoSo.tenBenhNhan}</h3>
                  <div className="text-blue-100 text-sm opacity-90 mt-1 pl-7 flex items-center flex-wrap gap-4">
                    <span>Chẩn đoán: {selectedHoSo.chanDoan}</span>
                    {/* Kiểm tra và hiển thị KTV */}
                    {(selectedHoSo as any).KyThuatVien ? (
                      <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded text-xs font-medium backdrop-blur-sm border border-white/10 shadow-sm">
                        <Briefcase size={12} className="text-white" />
                        KTV phụ trách: {(selectedHoSo as any).KyThuatVien?.TaiKhoan?.hoVaTen || 'Chưa cập nhật tên'}
                      </span>
                    ) : (selectedHoSo as any).BacSi ? (
                      <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded text-xs font-medium backdrop-blur-sm border border-white/10 shadow-sm">
                        <Stethoscope size={12} className="text-white" />
                        BS: {(selectedHoSo as any).BacSi?.TaiKhoan?.hoVaTen || 'Chưa cập nhật tên'}
                      </span>
                    ) : null}
                  </div>
                </div>
                <button onClick={() => setShowGoalModal(true)} className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-50 transition shadow-sm hover:shadow">
                  <Plus size={16} /> Thêm Mục tiêu
                </button>
              </div>

              {/*Mục tiêu & Lộ trình*/}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                {selectedHoSo.MucTieuDieuTri && selectedHoSo.MucTieuDieuTri.length > 0 ? (
                  <div className="space-y-4">
                    {selectedHoSo.MucTieuDieuTri.map((mt) => {
                      const priorityInfo = getRoutePriorityInfo(mt.mucDoUuTien);
                      return (
                        <div key={mt.maMucTieu} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                          <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-blue-50/50 transition border-l-4 border-l-blue-500" onClick={() => setExpandedMucTieu(expandedMucTieu === mt.maMucTieu ? null : mt.maMucTieu)}>
                            <div className="flex items-center gap-4">
                              <div className="p-2 bg-blue-100 text-blue-600 rounded-full"><Target size={20} /></div>
                              <div>
                                <div className="font-bold text-gray-800 text-lg">{mt.noiDung}</div>
                                <div className="text-xs text-gray-500 flex gap-3 mt-1 items-center">
                                  <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(mt.ngayDatMucTieu).toLocaleDateString('vi-VN')}</span>
                                  <div className={`text-[10px] flex items-center gap-1 px-2 py-0.5 rounded-full font-bold uppercase border ${priorityInfo.color}`}>
                                    {priorityInfo.icon} {priorityInfo.label}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 pl-4 border-l border-gray-100 ml-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteData({ id: mt.maMucTieu, name: mt.noiDung, type: 'GOAL' });
                                }}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all group relative"
                                title="Xóa mục tiêu này"
                              >
                                <Trash2 size={18} />
                              </button>

                              {/* Mũi tên mở rộng */}
                              <div className="text-gray-400">
                                {expandedMucTieu === mt.maMucTieu ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                              </div>
                            </div>
                          </div>

                          {expandedMucTieu === mt.maMucTieu && (
                            <div className="bg-gray-50 p-5 border-t border-gray-100 animate-in slide-in-from-top-2 duration-300">
                              <div className="flex justify-between items-center mb-4">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><Map size={14} />Lộ trình điều trị</h4>
                                <button onClick={() => { setTargetMucTieuId(mt.maMucTieu); setShowRouteModal(true); fetchKTV(); }} className="text-blue-600 text-sm font-semibold hover:text-blue-800 flex items-center gap-1 hover:underline"><Plus size={14} /> Thêm Giai đoạn</button>
                              </div>

                              {mt.LoTrinhDieuTri && mt.LoTrinhDieuTri.length > 0 ? (
                                <div className="space-y-3 pl-2 border-l-2 border-dashed border-gray-300 ml-2.5">
                                  {mt.LoTrinhDieuTri.map(lt => {
                                    console.log("Check Priority:", (lt as any).mucDoUuTien);
                                    return (
                                      <div key={lt.maLoTrinh} className={`bg-white p-4 rounded-lg border relative group transition-all ml-4 shadow-sm }`}>
                                        <div className="absolute -left-[26px] top-1/2 -translate-y-1/2 w-4 h-0.5 bg-gray-300"></div>
                                        <div className="flex justify-between items-center">
                                          <div>
                                            <div className="flex items-center gap-2">
                                              <div className="font-bold text-gray-800 text-base">{lt.tenLoTrinh}</div>
                                            </div>

                                            <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                                              <Clock size={12} /> <span className="font-medium text-gray-700">{new Date(lt.thoiGianBatDau).toLocaleDateString('vi-VN')}</span>
                                              <span>➔</span> <span className="font-medium text-gray-700">{new Date(lt.thoiGianKetThuc).toLocaleDateString('vi-VN')}</span>
                                            </div>
                                            {lt.KyThuatVien && <div className='flex items-center gap-1.5 text-xs text-gray-600 mt-2'><Briefcase size={14} className='text-green-500' /> KTV: <span className='font-semibold'>{lt.KyThuatVien.TaiKhoan.hoVaTen}</span></div>}

                                            {lt.ChiTietBaiTap && lt.ChiTietBaiTap.length > 0 && (
                                              <div className="mt-2 text-xs font-semibold text-blue-600 bg-blue-50 inline-block px-2 py-0.5 rounded border border-blue-100">
                                                {lt.ChiTietBaiTap.length} bài tập đã gán
                                              </div>
                                            )}
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <button
                                              onClick={() => handleOpenExerciseSetup(lt)}
                                              className="text-xs font-medium border border-gray-200 px-3 py-1.5 rounded-md hover:bg-blue-600 hover:text-white hover:border-blue-600 transition flex items-center gap-2"
                                            >
                                              <Dumbbell size={14} /> Chi tiết & Bài tập
                                            </button>

                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setDeleteData({ id: lt.maLoTrinh, name: lt.tenLoTrinh, type: 'ROUTE' });
                                              }}
                                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition border border-transparent hover:border-red-200"
                                              title="Xóa lộ trình"
                                            >
                                              <Trash2 size={16} />
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : <div className="text-center text-sm text-gray-400 py-6 border-2 border-dashed border-gray-200 rounded-lg bg-white/50">Chưa có lộ trình nào.</div>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : <div className="h-full flex flex-col items-center justify-center text-gray-400"><Target size={64} className="mb-4 opacity-20" /><p className="text-lg font-medium text-gray-500">Chưa thiết lập mục tiêu</p></div>}
              </div>
            </>
          ) : <div className="flex-1 flex flex-col items-center justify-center text-gray-400 italic bg-gray-50"><FileText size={64} className="mb-4 opacity-10 text-blue-500" /><p className="text-lg">Vui lòng chọn một hồ sơ bên trái để xem chi tiết.</p></div>}
        </div>
      </div>

      <GoalForm
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        onSubmit={handleAddGoalWrapper}
        submitting={submitting}
      />

      <TreatmentForm
        isOpen={showRouteModal}
        onClose={() => setShowRouteModal(false)}
        onSubmit={handleAddRouteWrapper}
        submitting={submitting}
        listKTV={listKTV}
      />

      <DeleteConfirmModal
        isOpen={!!deleteData}
        onClose={() => setDeleteData(null)}
        onConfirm={handleConfirmDelete}
        itemName={deleteData?.name || ''}
        type={deleteData?.type || 'ROUTE'}
        isSubmitting={submitting}
      />

    </div>
  );
};

export default TreatmentManager;