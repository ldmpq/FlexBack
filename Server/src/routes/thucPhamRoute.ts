import { Router } from 'express';
import { getAllThucPham, createThucPham, updateThucPham, deleteThucPham } from '../controllers/thucPhamController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', authenticateToken, getAllThucPham);
router.post('/', authenticateToken, createThucPham);
router.put('/:id', authenticateToken, updateThucPham);
router.delete('/:id', authenticateToken, deleteThucPham);

export default router;