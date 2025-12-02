import { Router } from 'express';
import { getTreatmentTree, createMucTieu, createLoTrinh } from '../controllers/treatmentController';

const router = Router();

// GET /api/treatment/:maHoSo -> Lấy cây lộ trình theo mã hồ sơ
router.get('/:maHoSo', getTreatmentTree);

// POST /api/treatment/muctieu -> Thêm mục tiêu
router.post('/muctieu', createMucTieu);

// POST /api/treatment/lotrinh -> Thêm lộ trình
router.post('/lotrinh', createLoTrinh);

export default router;