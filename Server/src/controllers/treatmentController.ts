import { Request, Response } from "express";
import { TreatmentService } from "../services/treatmentService";

// 1. Lấy chi tiết cây điều trị
export const getTreatmentTree = async (req: Request, res: Response) => {
    try {
        const maHoSo = Number(req.params.id); 

        if (isNaN(maHoSo)) {
             console.error("Lỗi: ID hồ sơ không hợp lệ:", req.params.id);
             return res.status(400).json({ message: "ID hồ sơ không hợp lệ" });
        }

        console.log(`Đang lấy dữ liệu điều trị cho hồ sơ: ${maHoSo}`);
        const data = await TreatmentService.getTreatmentTree(maHoSo);

        if (!data) {
            return res.status(404).json({ message: "Không tìm thấy hồ sơ" });
        }
        
        res.status(200).json({ data });
    } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

// 2. Tạo mục tiêu
export const createMucTieu = async (req: Request, res: Response) => {
    try {
        const newItem = await TreatmentService.createMucTieu(req.body);
        res.status(201).json({ message: "Thành công", data: newItem });
    } catch (error) {
        console.error("Lỗi tạo mục tiêu:", error);
        res.status(500).json({ message: "Lỗi tạo mục tiêu" });
    }
};

// 3. Tạo lộ trình
export const createLoTrinh = async (req: Request, res: Response) => {
    try {
        const newItem = await TreatmentService.createLoTrinh(req.body);
        res.status(201).json({ message: "Thành công", data: newItem });
    } catch (error) {
        console.error("Lỗi tạo lộ trình:", error);
        res.status(500).json({ message: "Lỗi tạo lộ trình" });
    }
};

// 4. Lấy danh sách bài tập
export const getExercises = async (req: Request, res: Response) => {
    try {
        const data = await TreatmentService.getAllExercises();
        res.status(200).json({ data });
    } catch (error) {
        console.error("Lỗi lấy bài tập:", error);
        res.status(500).json({ message: "Lỗi lấy bài tập" });
    }
};

// 5. Lấy danh sách Kỹ thuật viên
export const getTechnicians = async (req: Request, res: Response) => {
    try {
        const data = await TreatmentService.getTechnicians();
        res.status(200).json({ data });
    } catch (error) {
        console.error("Lỗi lấy KTV:", error);
        res.status(500).json({ message: "Lỗi lấy KTV" });
    }
};

// 6. Lưu cấu hình bài tập cho lộ trình
export const saveRouteExercises = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id); // maLoTrinh lấy từ URL
        const exercises = req.body; // Danh sách bài tập từ body
        
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID lộ trình không hợp lệ" });
        }

        await TreatmentService.saveRouteExercises(id, exercises);
        res.status(200).json({ message: "Lưu cấu hình bài tập thành công!" });
    } catch (error) {
        console.error("Lỗi lưu bài tập:", error);
        res.status(500).json({ message: "Lỗi lưu bài tập" });
    }
};