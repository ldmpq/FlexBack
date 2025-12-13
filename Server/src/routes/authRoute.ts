// src/routes/authRoutes.ts
import { Router } from 'express';
import { registerBenhNhan, login, getMe, register } from '../controllers/authController';

import { authenticateToken } from '../middlewares/authMiddleware';


const router = Router();

router.post('/register', register);

router.post('/register-benhnhan', registerBenhNhan);

router.post('/login', login);

router.get('/me', authenticateToken, getMe);

export default router;