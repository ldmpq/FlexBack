// Định nghĩa các Role trong hệ thống
export type AccountRole = 'BAC_SI' | 'KY_THUAT_VIEN' | 'ADMIN';

// Thông tin chi tiết mở rộng (Bác sĩ)
export interface BacSiInfo {
  chuyenKhoa: string;
  congTac: string;
  ngayBatDau: string;
}

// Thông tin chi tiết mở rộng (Kỹ thuật viên)
export interface KyThuatVienInfo {
  chungChi: string;
  ngayBatDau: string;
}

// Định nghĩa kiểu dữ liệu đầy đủ cho Tài khoản
export interface StaffAccount {
  maTaiKhoan: number;
  tenTaiKhoan: string;
  hoVaTen: string;
  email: string;
  diaChi: string;
  soDienThoai: string;
  loaiTaiKhoan: AccountRole;
  ngayTaoTaiKhoan: string;
  // Dữ liệu mở rộng (có thể có hoặc không tùy vào API list hay detail)
  BacSi?: BacSiInfo;
  KyThuatVien?: KyThuatVienInfo;
}

// Dữ liệu Form khi tạo mới hoặc cập nhật
export interface AccountFormData {
  tenTaiKhoan: string;
  hoVaTen: string;
  email: string;
  soDienThoai: string;
  loaiTaiKhoan: AccountRole;
  matKhau: string;
  xacNhanMatKhau: string;
  chuyenKhoa?: string;  // Dành cho Bác sĩ
  congTac?: string;     // Dành cho Bác sĩ
  chungChi?: string;    // Dành cho KTV
}