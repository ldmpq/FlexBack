export interface RegisterBenhNhanDTO {
  tenTaiKhoan: string;
  matKhau: string;
  hoVaTen: string;
  email: string;
  soDienThoai: string;
  gioiTinh: string;
  ngaySinh?: string;

  chieuCao?: string;
  canNang?: string;
  tienSuChanThuong?: string;
  tinhTrangHienTai?: string;
}

export interface LoginDTO {
  tenTaiKhoan: string;
  matKhau: string;
}