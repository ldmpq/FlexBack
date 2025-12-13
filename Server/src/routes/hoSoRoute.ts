// src/routes/hoSoRoutes.ts
import { Router } from 'express';
import { createHoSoBenhAn, getListBacSi } from '../controllers/hoSoController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Định nghĩa: POST /api/hoso
// Flow: Client gọi -> Check Token -> Controller xử lý
router.post('/', authenticateToken, createHoSoBenhAn);
router.get('/bac-si', authenticateToken, getListBacSi);

export default router;