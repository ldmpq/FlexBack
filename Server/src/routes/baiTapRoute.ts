import { Router } from 'express';
import { getExercises, getNhomCo, createExercise, deleteExercise } from '../controllers/baiTapController';
import multer from 'multer';
import path from 'path';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/videos/');
  },
  filename: (req, file, cb) => {
    const name = Date.now() + '-' + file.originalname.replace(/\s+/g, '');
    cb(null, name);
  }
});

const upload = multer({ storage });
// POST /api/exercises -> Thêm bài tập (KÈM UPLOAD VIDEO)
router.post('/', upload.single('videoFile'), createExercise);
// GET list nhóm cơ
router.get('/nhom-co', getNhomCo);
// GET list bài tập
router.get('/', getExercises);
// DELETE bài tập
router.delete('/:id', deleteExercise);

export default router;