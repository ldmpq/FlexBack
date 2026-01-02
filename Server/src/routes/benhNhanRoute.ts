import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import { getMyAssignedPatients, getPatientById } from '../controllers/benhNhanController';

const router = Router();

router.get('/assigned', authenticateToken, getMyAssignedPatients);

router.get('/:id', authenticateToken, getPatientById);

export default router;