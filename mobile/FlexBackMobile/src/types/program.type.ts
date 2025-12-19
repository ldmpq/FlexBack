export interface LoTrinh {
  maLoTrinh: number;
  tenLoTrinh: string;
  thoiGianBatDau: string;
  thoiGianKetThuc: string;
  ghiChu: string;
  trangThai?: string;
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
}