import express from 'express';

import { authenticateToken } from '../middleware/authMiddleware';
import { getUnclaimedTransactions } from '../controllers/payrollController';

const router = express.Router();

router.get('/transactions', authenticateToken as any, getUnclaimedTransactions as any);

export default router;
