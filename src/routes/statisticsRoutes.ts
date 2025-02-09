import express from 'express';

import { authenticateToken } from '../middleware/authMiddleware';
import { getCurrentWeekSales } from '../controllers/statisticsController';

const router = express.Router();

router.get('/weekly/sales', authenticateToken as any, getCurrentWeekSales as any);

export default router;
