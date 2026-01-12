import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import authRoute from './routes/authRoute';
import accountRoute from './routes/accountRoute';
import dieuTriRoute from './routes/dieuTriRoute';
import exerciseRoute from './routes/baiTapRoute';
import hoSoRoute from './routes/hoSoRoute';
import treatmentRoute from './routes/treatmentRoute';
import keHoachRoute from './routes/dieuTriRoute';
import userRoute from './routes/userRoute';
import baoCaoRoute from './routes/baocaoRoute';
import thuocRoute from './routes/thuocRoute';
import thucPhamRoute from './routes/thucPhamRoute';
import nhomCoRoute from './routes/nhomCoRoute';
import benhNhanRoute from './routes/benhNhanRoute';
import thongBaoRoute from './routes/thongBaoRoute';
import dashBoardRoute from './routes/dashboardRoutes'

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // Quan trọng: Đọc JSON từ body request
app.use(express.urlencoded({ extended: true }));

// Cấu hình Routes
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoute);
app.use('/api/hoso', hoSoRoute);
app.use('/api/dieutri', dieuTriRoute);
app.use('/api/users', userRoute);
app.use('/api/exercises', exerciseRoute);
app.use('/api/treatment', treatmentRoute);
app.use('/api/bai-tap-hom-nay', keHoachRoute);
app.use('/api/accounts', accountRoute);
app.use('/api/baocao', baoCaoRoute);
app.use('/api/thuoc', thuocRoute);
app.use('/api/thucPham', thucPhamRoute);
app.use('/api/nhom-co', nhomCoRoute);
app.use('/api/benh-nhan', benhNhanRoute);
app.use('/api/thongbao', thongBaoRoute);
app.use('/api/dashboard', dashBoardRoute);

// Route test server
app.get('/', (req: Request, res: Response) => {
  res.send('FlexBack Backend Server is ready!');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});