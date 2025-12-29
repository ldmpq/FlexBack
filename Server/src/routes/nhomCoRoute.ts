import { Router } from 'express';
import { getAllNhomCo, createNhomCo, updateNhomCo, deleteNhomCo } from '../controllers/nhomCoController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Base URL: /api/nhom-co
router.get('/', authenticateToken, getAllNhomCo);
router.post('/', authenticateToken, createNhomCo);
router.put('/:id', authenticateToken, updateNhomCo);
router.delete('/:id', authenticateToken, deleteNhomCo);

export default router;