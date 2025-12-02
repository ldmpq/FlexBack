// src/routes/authRoutes.ts
import { Router } from 'express';
import { registerBenhNhan, login, getMe } from '../controllers/authController';

import { authenticateToken } from '../middlewares/authMiddleware';


const router = Router();

// Định nghĩa đường dẫn: POST /api/auth/register-benhnhan
router.post('/register-benhnhan', registerBenhNhan);

router.post('/login', login);

// Method GET: /api/auth/me
router.get('/me', authenticateToken, getMe);

export default router;