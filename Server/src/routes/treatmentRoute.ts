import { Router } from "express";
import { getTreatmentTree, createMucTieu,  deleteMucTieu, createLoTrinh, deleteLoTrinh, saveRouteExercises, getExercises, getTechnicians} from "../controllers/treatmentController";

const router = Router();

// GET /api/treatment/:id -> Lấy cây lộ trình
router.get("/:id", getTreatmentTree);

// POST /api/treatment/muctieu -> Thêm mục tiêu
router.post("/muctieu", createMucTieu);

// DELETE /api/treatment/goal/:id -> Xóa mục tiêu
router.delete('/muctieu/:id', deleteMucTieu);

// POST /api/treatment/lotrinh -> Thêm lộ trình
router.post("/lotrinh", createLoTrinh);

// DELETE /api/treatment/lotrinh/:id -> Xóa lộ trình
router.delete("/lotrinh/:id", deleteLoTrinh);

// POST /api/treatment/lotrinh/:id/exercises -> Lưu cấu hình bài tập cho lộ trình
router.post("/lotrinh/:id/exercises", saveRouteExercises);

// GET /exercises
router.get("/exercises/list", getExercises); 

// GET /technicians/list
router.get("/technicians/list", getTechnicians);

export default router;