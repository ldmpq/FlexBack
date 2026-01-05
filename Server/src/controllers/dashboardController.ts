import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboardService';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [summary, statusDist, weeklyActivity] = await Promise.all([
      DashboardService.getSummaryStats(),
      DashboardService.getStatusDistribution(),
      DashboardService.getWeeklyActivity()
    ]);

    res.status(200).json({
      message: 'Success',
      data: { summary, statusDist, weeklyActivity }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};