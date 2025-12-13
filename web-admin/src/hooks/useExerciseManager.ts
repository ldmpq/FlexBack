import { useState, useEffect, useMemo } from 'react';
import { exerciseService } from '../services/exercise.service';
import type { Exercise, NhomCo, ExerciseFormData } from '../types/exercise.type';

export const useExerciseManager = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [nhomCos, setNhomCos] = useState<NhomCo[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterNhomCo, setFilterNhomCo] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // State cho việc Sửa
  const [editingId, setEditingId] = useState<number | null>(null);

  const initialFormState: ExerciseFormData = {
    tenBaiTap: '', maNhomCo: '', mucDo: 'Dễ',
    dungCuCanThiet: '', videoLink: '', moTaBaiTap: ''
  };
  const [formData, setFormData] = useState<ExerciseFormData>(initialFormState);
  
  const [videoInputType, setVideoInputType] = useState<'link' | 'file'>('link');
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // --- API CALLS ---
  const fetchData = async () => {
    try {
      setLoading(true);
      const [exList, ncList] = await Promise.all([
        exerciseService.getExercises(),
        exerciseService.getNhomCos()
      ]);
      setExercises(exList);
      setNhomCos(ncList);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- HELPERS ---
  const isYoutubeLink = (link: string) => link?.startsWith('http');

  const resetForm = () => {
    setFormData(initialFormState);
    setVideoFile(null);
    setVideoInputType('link');
    setEditingId(null); // Reset trạng thái sửa
  };

  // --- HANDLERS ---
  
  // 1. Hàm chuẩn bị dữ liệu để Sửa
  const handleEdit = (ex: Exercise) => {
    setEditingId(ex.maBaiTap);
    setFormData({
      tenBaiTap: ex.tenBaiTap,
      maNhomCo: ex.maNhomCo.toString(),
      mucDo: ex.mucDo,
      dungCuCanThiet: ex.dungCuCanThiet,
      videoLink: isYoutubeLink(ex.videoHuongDan) ? ex.videoHuongDan : '',
      moTaBaiTap: ex.moTaBaiTap
    });
    
    // Nếu video cũ là link thì set link, nếu là file thì để trống (không load file cũ xuống client được)
    setVideoInputType(isYoutubeLink(ex.videoHuongDan) ? 'link' : 'file');
    setVideoFile(null); 
    
    setShowModal(true);
  };

  // 2. Hàm Submit (Xử lý cả Thêm và Sửa)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tenBaiTap || !formData.maNhomCo) return alert("Vui lòng nhập tên và chọn nhóm cơ!");
    
    // Validate video: Chỉ bắt buộc khi THÊM MỚI. Khi sửa, nếu không chọn video mới thì giữ video cũ.
    if (!editingId) {
        if (videoInputType === 'file' && !videoFile) return alert("Vui lòng chọn video tải lên!");
        if (videoInputType === 'link' && !formData.videoLink) return alert("Vui lòng nhập link video!");
    }

    try {
      setSubmitting(true);
      const dataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'videoLink') dataToSend.append(key, (formData as any)[key]);
      });
      
      if (videoInputType === 'link' && formData.videoLink) {
        dataToSend.append('videoLink', formData.videoLink);
      } else if (videoFile) {
        dataToSend.append('videoFile', videoFile);
      }

      if (editingId) {
        // Gọi API Update
        await exerciseService.updateExercise(editingId, dataToSend);
        alert("Cập nhật bài tập thành công!");
      } else {
        // Gọi API Create
        await exerciseService.createExercise(dataToSend);
        alert("Thêm bài tập thành công!");
      }

      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa bài tập này?")) return;
    try {
      await exerciseService.deleteExercise(id);
      setExercises(prev => prev.filter(e => e.maBaiTap !== id));
    } catch (error) {
      alert("Không thể xóa bài tập này.");
    }
  };

  const filteredList = useMemo(() => {
    return exercises.filter(ex => {
      const matchName = ex.tenBaiTap.toLowerCase().includes(searchTerm.toLowerCase());
      const matchNhomCo = filterNhomCo ? ex.maNhomCo.toString() === filterNhomCo : true;
      return matchName && matchNhomCo;
    });
  }, [exercises, searchTerm, filterNhomCo]);

  return {
    exercises, nhomCos, loading, filteredList,
    searchTerm, setSearchTerm, filterNhomCo, setFilterNhomCo,
    showModal, setShowModal, submitting,
    formData, setFormData,
    videoInputType, setVideoInputType, videoFile, setVideoFile,
    handleSubmit, handleDelete, handleEdit, resetForm, isYoutubeLink,
    editingId // Export ra để UI biết đang thêm hay sửa
  };
};