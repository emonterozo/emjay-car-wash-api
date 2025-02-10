import express from 'express';

import { authenticateToken } from '../middleware/authMiddleware';
import { getCurrentWeekSales, getSalesStatistics } from '../controllers/statisticsController';

const router = express.Router();

router.get('/sales', authenticateToken as any, getSalesStatistics as any);
router.get('/weekly/sales', authenticateToken as any, getCurrentWeekSales as any);

export default router;
