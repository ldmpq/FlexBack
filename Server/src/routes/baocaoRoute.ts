import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import { createBaoCao } from '../controllers/baoCaoController';

const router = Router();

// Báo cáo kết quả tập luyện
router.post('/', authenticateToken, createBaoCao);

export default router;