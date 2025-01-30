import express from 'express';

import { authenticateToken } from '../middleware/authMiddleware';
import { getTransactions, getTransactionDetailsById } from '../controllers/transactionsController';

const router = express.Router();

router.get('/', authenticateToken as any, getTransactions as any);
router.get(
  '/:transaction_id/services/:transaction_service_id',
  authenticateToken as any,
  getTransactionDetailsById as any,
);

export default router;
