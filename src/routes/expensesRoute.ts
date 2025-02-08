import express from 'express';
import { getAllExpenses, postExpense } from '../controllers/expensesController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken as any, getAllExpenses as any);
router.post('/', authenticateToken as any, postExpense as any);

export default router;
