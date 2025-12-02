// src/index.ts
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes';

import hoSoRoutes from './routes/hoSoRoutes';

import dieuTriRoutes from './routes/dieuTriRoutes';

import userRoutes from './routes/userRoutes';

import exerciseRoutes from './routes/exerciseRoutes';

import treatmentRoutes from './routes/treatmentRoutes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // Quan trọng: Để đọc được JSON từ body request

// Cấu hình Routes
app.use('/api/auth', authRoutes);

app.use('/api/hoso', hoSoRoutes);
app.use('/api/dieutri', dieuTriRoutes);
app.use('/api/users', userRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/treatment', treatmentRoutes);

// Route test server
app.get('/', (req: Request, res: Response) => {
  res.send('FlexBack Backend Server is ready!');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});