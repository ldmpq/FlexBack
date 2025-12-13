export interface User {
  maTaiKhoan: number;
  tenTaiKhoan: string;
  hoVaTen: string;
  loaiTaiKhoan: 'BENH_NHAN' | 'BAC_SI' | 'KY_THUAT_VIEN' | 'ADMIN';
  avatar?: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginCredentials {
  tenTaiKhoan: string;
  matKhau: string;
}