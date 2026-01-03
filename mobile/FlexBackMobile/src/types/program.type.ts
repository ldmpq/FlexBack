export interface LoTrinh {
  maLoTrinh: number;
  tenLoTrinh: string;
  thoiGianBatDau: string;
  thoiGianKetThuc: string;
  ghiChu: string;
  trangThai?: string;
  ChiTietBaiTap?: ExerciseDetail[];
}

export interface MucTieu {
  maMucTieu: number;
  noiDung: string;
  mucDoUuTien: string;
  trangThai: string;
  ngayDatMucTieu: string;
  LoTrinhDieuTri: LoTrinh[];
}

export interface ProgramData {
  maHoSo: number;
  ngayLapHoSo: string;
  chanDoan: string;
  MucTieuDieuTri: MucTieu[];
  KyThuatVien?: {
    maKyThuatVien: number;
    TaiKhoan: { hoVaTen: string };
  } | null;
  PhanCong?: {
    maKyThuatVien: number;
    KyThuatVien: {
      TaiKhoan: { hoVaTen: string };
    };
  }[];
}

export interface ExerciseDetail {
  maBaiTap: number;
  tenBaiTap: string;
  soSet: number;
  soRep: number;
  thoiLuongPhut: number;
  ghiChu?: string;
  videoHuongDan?: string;
  moTaBaiTap?: string;
  doKho?: string;
  dungCuCanThiet?: string;
}