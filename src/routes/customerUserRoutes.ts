import express from 'express';
import { getTransactions } from '../controllers/customerUserController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/queue', authenticateToken as any, getTransactions as any);

export default router;
