import { Router } from 'express';
import { getAllThuoc, createThuoc, updateThuoc, deleteThuoc } from '../controllers/thuocController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', authenticateToken, getAllThuoc);
router.post('/', authenticateToken, createThuoc);
router.put('/:id', authenticateToken, updateThuoc);
router.delete('/:id', authenticateToken, deleteThuoc);

export default router;