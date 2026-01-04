// Thông tin bác sĩ cho dropdown chọn
export interface DoctorOption {
  maBacSi: number;
  TaiKhoan: { hoVaTen: string };
  chuyenKhoa: string;
  hoVaTen?: string;
}

export interface KtvOption {
  maKyThuatVien: number;
  TaiKhoan: { hoVaTen: string};
  chungChi: string;
  hoVaTen?: string;
}

// Chi tiết 1 hồ sơ bệnh án
export interface MedicalRecord {
  maHoSo: number;
  ngayLapHoSo: string;
  chanDoan: string;
  BacSi?: {
    hoVaTen?: string;
    TaiKhoan?: { hoVaTen: string };
  };
  PhanCong?: Array<{
    KyThuatVien: {
      TaiKhoan: {
        hoVaTen: string;
      };
    };
  }>;
}

// Thông tin chi tiết bệnh nhân
export interface PatientDetailData {
  hoVaTen: string;
  gioiTinh: string;
  ngaySinh: string;
  soDienThoai: string;
  diaChi: string;
  BenhNhan?: {
    maBenhNhan: number;
    chieuCao?: number;
    canNang?: number;
    tinhTrangHienTai?: string;
    HoSoBenhAn: MedicalRecord[];
  };
}

// Dữ liệu Form tạo mới hồ sơ
export interface CreateHoSoForm {
  chanDoan: string;
  trangThaiHienTai: string;
  maBacSi: string;
  maKyThuatVien?: string
}