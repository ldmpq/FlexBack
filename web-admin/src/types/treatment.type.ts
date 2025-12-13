export interface TaiKhoan {
  hoVaTen: string;
}

export interface BaiTap {
  maBaiTap: number;
  tenBaiTap: string;
  doKho: string | null;
  dungCuCanThiet: string;
  maNhomCo: number;
}

// Cấu hình bài tập trong lộ trình
export interface BaiTapConfig extends BaiTap {
  soSet: number;
  soRep: number;
  thoiLuongPhut: number;
  ghiChu?: string;
}

export interface LoTrinh {
  maLoTrinh: number;
  tenLoTrinh: string;
  thoiGianBatDau: string;
  thoiGianKetThuc: string;
  ghiChu: string;
  KyThuatVien?: { TaiKhoan: TaiKhoan };
  ChiTietBaiTap?: BaiTapConfig[];
}

export interface MucTieu {
  maMucTieu: number;
  noiDung: string;
  mucDoUuTien: string;
  trangThai: string;
  ngayDatMucTieu: string;
  LoTrinhDieuTri?: LoTrinh[];
}

export interface HoSo {
  maHoSo: number;
  ngayLapHoSo: string;
  chanDoan: string;
  BenhNhan?: { TaiKhoan: TaiKhoan };
  tenBenhNhan?: string;
  MucTieuDieuTri?: MucTieu[];
}

export interface KTVOption {
  maKyThuatVien: number;
  TaiKhoan: TaiKhoan;
}

// Form
export interface TreatmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  submitting: boolean;
  listKTV: any[]; // Danh sách KTV để select
}