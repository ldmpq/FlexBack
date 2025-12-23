import { Router } from "express";
import { getTreatmentTree, createMucTieu, createLoTrinh, saveRouteExercises, getExercises, getTechnicians } from "../controllers/treatmentController";

const router = Router();

// GET /api/treatment/:id -> Lấy cây lộ trình
router.get("/:id", getTreatmentTree);

// POST /api/treatment/muctieu -> Thêm mục tiêu
router.post("/muctieu", createMucTieu);

// POST /api/treatment/lotrinh -> Thêm lộ trình
router.post("/lotrinh", createLoTrinh);

// POST /api/treatment/lotrinh/:id/exercises -> Lưu cấu hình bài tập cho lộ trình
router.post("/lotrinh/:id/exercises", saveRouteExercises);

// GET /exercises
router.get("/exercises/list", getExercises); 
router.get("/technicians/list", getTechnicians);

export default router;