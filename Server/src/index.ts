import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import authRoutes from './routes/authRoute';
import accountRoutes from './routes/accountRoute';
import dieuTriRoutes from './routes/dieuTriRoute';
import exerciseRoutes from './routes/baiTapRoute';
import hoSoRoutes from './routes/hoSoRoute';
import treatmentRoutes from './routes/treatmentRoute';
import userRoutes from './routes/userRoute';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // Quan trọng: Để đọc được JSON từ body request
app.use(express.urlencoded({ extended: true }));

// Cấu hình Routes
app.use(
  '/uploads',
  express.static(path.join(__dirname, '../uploads'))
);

app.use('/api/auth', authRoutes);
app.use('/api/hoso', hoSoRoutes);
app.use('/api/dieutri', dieuTriRoutes);
app.use('/api/users', userRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/treatment', treatmentRoutes);
app.use('/api/accounts', accountRoutes)

// Route test server
app.get('/', (req: Request, res: Response) => {
  res.send('FlexBack Backend Server is ready!');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});