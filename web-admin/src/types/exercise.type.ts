export interface NhomCo {
  maNhomCo: number;
  tenNhomCo: string;
}

export interface Exercise {
  doKho(doKho: any): unknown;
  maBaiTap: number;
  tenBaiTap: string;
  maNhomCo: number;
  NHOM_CO?: { tenNhomCo: string };
  mucDo: string;
  dungCuCanThiet: string;
  videoHuongDan: string; // Chứa link YT hoặc path file
  moTaBaiTap: string;
}

// Kiểu dữ liệu cho Form state
export interface ExerciseFormData {
  tenBaiTap: string;
  maNhomCo: string;
  mucDo: string;
  dungCuCanThiet: string;
  videoLink: string;
  moTaBaiTap: string;
}

// Dành cho props của ExerciseForm component
export interface ExerciseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  editingId: number | null;
  formData: ExerciseFormData;
  setFormData: React.Dispatch<React.SetStateAction<ExerciseFormData>>;
  nhomCos: NhomCo[];
  videoInputType: 'link' | 'file';
  setVideoInputType: (type: 'link' | 'file') => void;
  videoFile: File | null;
  setVideoFile: (file: File | null) => void;
}