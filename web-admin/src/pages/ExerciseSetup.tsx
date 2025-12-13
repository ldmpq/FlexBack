import React, { useState } from 'react';
import { ArrowLeft, Save, Search, CheckCircle, Dumbbell, Activity, X } from 'lucide-react';
import type { LoTrinh } from '../types/treatment.type';
import { useExerciseSetup } from '../hooks/useExerciseSetup';

interface Props {
  loTrinh: LoTrinh;
  onBack: () => void;
  onSave: () => void;
}

const ExerciseSetup: React.FC<Props> = ({ loTrinh, onBack, onSave }) => {
  const { allExercises, selectedExercises, loading, isSaving, toggleExercise, updateConfig, saveConfiguration } = useExerciseSetup(loTrinh, () => {
    onSave();
    onBack();
  });
  
  const [filter, setFilter] = useState('');

  const getDifficultyColor = (level: string) => {
    const lvl = level?.toLowerCase() || '';
    if (lvl.includes('de') || lvl === 'dễ') return 'bg-green-100 text-green-700';
    if (lvl.includes('trung') || lvl === 'vừa') return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition" title="Quay lại">
            <ArrowLeft size={24}/>
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Thiết lập Bài tập</h2>
            <p className="text-sm text-gray-500">Lộ trình: <span className="font-medium text-blue-600">{loTrinh.tenLoTrinh}</span></p>
          </div>
        </div>
        <button 
          onClick={saveConfiguration}
          disabled={isSaving}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 shadow-md transition disabled:opacity-70"
        >
          {isSaving ? 'Đang lưu...' : <><Save size={18}/> Lưu thay đổi</>}
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex gap-6 p-6">
        {/* CỘT TRÁI: KHO BÀI TẬP */}
        <div className="w-1/2 bg-white rounded-xl shadow border border-gray-200 flex flex-col">
          <div className="p-4 border-b bg-gray-50 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18}/>
              <input 
                className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tìm kiếm bài tập..."
                value={filter} onChange={e => setFilter(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {loading ? <div className="text-center p-4">Đang tải kho bài tập...</div> : 
             allExercises.filter(ex => ex.tenBaiTap?.toLowerCase().includes(filter.toLowerCase())).map(ex => {
              const isSelected = !!selectedExercises[ex.maBaiTap];
              return (
                <div 
                  key={ex.maBaiTap} 
                  onClick={() => toggleExercise(ex)}
                  className={`p-3 rounded-lg border cursor-pointer transition flex items-center justify-between group select-none
                    ${isSelected ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-200' : 'bg-white border-gray-200 hover:border-blue-300'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition
                      ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'}`}>
                      {isSelected && <CheckCircle size={14} className="text-white"/>}
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">{ex.tenBaiTap}</div>
                      <div className="text-xs text-gray-500 flex gap-2 mt-1">
                        <span className={`px-1.5 py-0.5 rounded ${getDifficultyColor(ex.mucDo || "Không xác định")}`}>{ex.mucDo}</span>
                        <span className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded"><Dumbbell size={10}/> {ex.dungCuCanThiet}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CỘT PHẢI: DANH SÁCH ĐÃ CHỌN & CẤU HÌNH */}
        <div className="w-1/2 bg-white rounded-xl shadow border border-gray-200 flex flex-col">
          <div className="p-4 border-b bg-blue-50 font-bold text-blue-800 flex justify-between items-center">
            <span>Đã chọn ({Object.keys(selectedExercises).length})</span>
            <span className="text-xs font-normal text-blue-600 italic">Điều chỉnh thông số bên dưới</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {Object.keys(selectedExercises).length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                <Dumbbell size={48} className="mb-2"/>
                <p>Chưa chọn bài tập nào</p>
              </div>
            ) : (
              Object.values(selectedExercises).map((config) => (
                <div key={config.maBaiTap} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm animate-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-gray-800 flex items-center gap-2">
                      <Activity size={16} className="text-blue-500"/> {config.tenBaiTap}
                    </h4>
                    <button onClick={() => toggleExercise(config as any)} className="text-red-400 hover:text-red-600" title="Xóa"><X size={16}/></button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1 block">Số Set</label>
                      <input type="number" className="w-full border rounded p-1.5 text-sm font-medium text-center focus:ring-2 focus:ring-blue-500 outline-none"
                        value={config.soSet} onChange={e => updateConfig(config.maBaiTap, 'soSet', parseInt(e.target.value) || 0)}/>
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1 block">Số Reps</label>
                      <input type="number" className="w-full border rounded p-1.5 text-sm font-medium text-center focus:ring-2 focus:ring-blue-500 outline-none"
                        value={config.soRep} onChange={e => updateConfig(config.maBaiTap, 'soRep', parseInt(e.target.value) || 0)}/>
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1 block">Phút/Set</label>
                      <input type="number" className="w-full border rounded p-1.5 text-sm font-medium text-center focus:ring-2 focus:ring-blue-500 outline-none"
                        value={config.thoiLuongPhut} onChange={e => updateConfig(config.maBaiTap, 'thoiLuongPhut', parseInt(e.target.value) || 0)}/>
                    </div>
                  </div>
                  <div>
                    <input className="w-full border-b bg-transparent py-1 text-sm outline-none focus:border-blue-500 text-gray-600 placeholder-gray-400"
                      placeholder="Ghi chú (VD: Nghỉ 30s giữa các hiệp)..."
                      value={config.ghiChu || ''} onChange={e => updateConfig(config.maBaiTap, 'ghiChu', e.target.value)}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseSetup;