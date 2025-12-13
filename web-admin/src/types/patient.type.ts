export interface Patient {
  maTaiKhoan: number;
  hoVaTen: string;
  tenTaiKhoan: string;
  email: string;
  soDienThoai: string;
  gioiTinh: string;
  ngaySinh: string;
  BenhNhan: {
    tinhTrangHienTai: string;
  }[];
}