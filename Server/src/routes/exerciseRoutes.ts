import { Router } from 'express';
import { getExercises, getNhomCo, createExercise, deleteExercise } from '../controllers/exerciseController';

const router = Router();

// GET /api/exercises/nhom-co -> Lấy list nhóm cơ
router.get('/nhom-co', getNhomCo);

// GET /api/exercises -> Lấy list bài tập
router.get('/', getExercises);

// POST /api/exercises -> Thêm bài tập
router.post('/', createExercise);

// DELETE /api/exercises/:id -> Xóa bài tập
router.delete('/:id', deleteExercise);

export default router;