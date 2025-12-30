export interface NhomCo {
  maNhomCo: number;
  tenNhomCo: string;
  moTaNhomCo?: string;
  createdAt?: string;
}

export interface CreateNhomCoDTO {
  tenNhomCo: string;
  moTaNhomCo?: string;
}