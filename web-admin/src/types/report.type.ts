export interface ReportData {
  maBaoCao: number;
  ngayLuyenTap: string;
  mucDoDau: number;
  thoiLuong: number;
  danhGiaSoBo?: string;
  KeHoachDieuTri?: {
    tenKeHoach: string;
    LoTrinhDieuTri: {
      tenLoTrinh: string;
      MucTieuDieuTri: {
        HoSoBenhAn: {
          BenhNhan: {
            TaiKhoan: {
              hoVaTen: string;
            }
          }
        }
      }
    }
  }
}