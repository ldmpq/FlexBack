export interface ReportHistory {
  maBaoCao: number;
  ngayLuyenTap: string;
  thoiLuong: number;
  mucDoDau: number;
  danhGiaSoBo: string;
  KeHoachDieuTri?: {
    tenKeHoach: string;
    LoTrinhDieuTri?: {
      tenLoTrinh: string;
    }
  };
}