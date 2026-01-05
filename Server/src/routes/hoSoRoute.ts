// src/routes/hoSoRoutes.ts
import { Router } from 'express';
import { createHoSoBenhAn, updateHoSoBenhAn, getListBacSi, getListKTV } from '../controllers/hoSoController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Định nghĩa: POST /api/hoso
// Flow: Client gọi -> Check Token -> Controller xử lý
router.post('/', authenticateToken, createHoSoBenhAn);
router.put('/:id', authenticateToken, updateHoSoBenhAn);
router.get('/bac-si', authenticateToken, getListBacSi);
router.get('/ky-thuat-vien', authenticateToken, getListKTV);

export default router;