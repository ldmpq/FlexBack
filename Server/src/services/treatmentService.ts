import { TreatmentModel } from "../models/treatmentModel";

export class TreatmentService {
    // 1. Lấy cây dữ liệu và Format lại cấu trúc
    static async getTreatmentTree(maHoSo: number) {
        const data = await TreatmentModel.getTreatmentTree(maHoSo);
        if (!data) return null;
        
        const formattedData = {
            ...data,
            MucTieuDieuTri: data.MucTieuDieuTri.map(mt => ({
                ...mt,
                mucDoUuTien: mt.trangThai || 'BinhThuong', 
                LoTrinhDieuTri: mt.LoTrinhDieuTri.map(lt => {
                    // Gom tất cả bài tập từ tất cả các kế hoạch con của lộ trình này lại
                    let allExercises: any[] = [];
                    
                    if (lt.KeHoachDieuTri && lt.KeHoachDieuTri.length > 0) {
                        lt.KeHoachDieuTri.forEach(kh => {
                            if (kh.ChiTietKeHoach) {
                                const exercises = kh.ChiTietKeHoach.map(ct => ({
                                    // Thông tin cấu hình
                                    soSet: ct.sets,
                                    soRep: ct.reps,
                                    // Parse 'cuongDo' thành thoiLuongPhut
                                    thoiLuongPhut: parseInt(ct.cuongDo || '0') || 0, 
                                    ghiChu: ct.ghiChu,
                                    
                                    // Thông tin bài tập
                                    maBaiTap: ct.BaiTapPhucHoi?.maBaiTap,
                                    tenBaiTap: ct.BaiTapPhucHoi?.tenBaiTap,
                                    doKho: ct.BaiTapPhucHoi?.mucDo, 
                                    dungCuCanThiet: ct.BaiTapPhucHoi?.dungCuCanThiet,
                                    maNhomCo: ct.BaiTapPhucHoi?.maNhomCo,
                                    videoHuongDan: ct.BaiTapPhucHoi?.videoHuongDan,
                                    moTaBaiTap: ct.BaiTapPhucHoi?.moTaBaiTap
                                }));
                                allExercises = [...allExercises, ...exercises];
                            }
                        });
                    }

                    return {
                        ...lt,
                        ChiTietBaiTap: allExercises // Trả về mảng phẳng cho UI
                    };
                })
            }))
        };

        return formattedData;
    }

    // 2. Tạo mục tiêu
    static async createMucTieu(data: any) {
        return TreatmentModel.createMucTieu({
            maHoSo: Number(data.maHoSo),
            noiDung: data.noiDung,
            mucDoUuTien: data.mucDoUuTien || "Bình thường",
            trangThai: data.trangThai || "Chưa hoàn thành", 
            ngayDatMucTieu: new Date(data.ngayDatMucTieu)
        });
    }

    // 3. Tạo lộ trình
    static async createLoTrinh(data: any) {
        return TreatmentModel.createLoTrinh({
            maMucTieu: Number(data.maMucTieu),
            tenLoTrinh: data.tenLoTrinh,
            thoiGianBatDau: new Date(data.thoiGianBatDau),
            thoiGianKetThuc: new Date(data.thoiGianKetThuc),
            ghiChu: data.ghiChu,
            maKyThuatVien: data.maKyThuatVien ? Number(data.maKyThuatVien) : null
        });
    }

    // 4. Các hàm hỗ trợ khác
    // Lấy tất cả bài tập
    static async getAllExercises() {
        return TreatmentModel.getAllExercises();
    }
    // Lấy danh sách kỹ thuật viên
    static async getTechnicians() {
        return TreatmentModel.getTechnicians();
    }
    // Lưu bài tập cho lộ trình
    static async saveRouteExercises(maLoTrinh: number, exercises: any[]) {
        return TreatmentModel.saveRouteExercises(maLoTrinh, exercises);
    }
}
