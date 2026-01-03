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

export interface Feedback {
  maThongBao: number;
  tieuDe: string;
  noiDung: string;
  ngayTao: string;
  thangDiem: number;
  daDoc: boolean;
  BacSi?: {
    hoVaTen: string;
  };
}