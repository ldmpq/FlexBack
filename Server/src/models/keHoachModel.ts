export interface CreateKeHoachDTO {
  maLoTrinh: string;
  tenKeHoach: string;
  moTa?: string;
  thoiGianBatDau?: string;
  thoiGianKetThuc?: string;
}

export interface AddBaiTapDTO {
  maKeHoach: string;
  maBaiTap: string;
  sets?: string;
  reps?: string;
  cuongDo?: string;
  ghiChu?: string;
}

