import { Router } from "express";
import { 
    getTreatmentTree, 
    createMucTieu, 
    createLoTrinh, 
    saveRouteExercises, 
    getExercises, 
    getTechnicians 
} from "../controllers/treatmentController";

const router = Router();

// GET /api/treatment/:id -> Lấy cây lộ trình (Sửa :maHoSo thành :id)
router.get("/:id", getTreatmentTree);

// POST /api/treatment/muctieu -> Thêm mục tiêu
router.post("/muctieu", createMucTieu);

// POST /api/treatment/lotrinh -> Thêm lộ trình
router.post("/lotrinh", createLoTrinh);

// POST /api/treatment/lotrinh/:id/exercises -> Lưu cấu hình bài tập cho lộ trình
router.post("/lotrinh/:id/exercises", saveRouteExercises);

// GET /exercises (Lưu ý: Nếu frontend gọi /exercises trực tiếp, bạn cần một router riêng hoặc điều chỉnh frontend)
// Tạm thời để ở đây nếu bạn mount router tại root hoặc xử lý path rewrite
router.get("/exercises/list", getExercises); 
router.get("/technicians/list", getTechnicians);

export default router;