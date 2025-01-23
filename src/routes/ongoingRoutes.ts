import express from 'express';
import {
  createOngoingTransaction,
  addTransactionService,
  getTransactions,
  getTransactionServicesById,
  getTransactionServiceById,
} from '../controllers/ongoingController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/transactions', authenticateToken as any, getTransactions as any);
router.get(
  '/transactions/:transaction_id/services',
  authenticateToken as any,
  getTransactionServicesById as any,
);
router.get(
  '/transactions/:transaction_id/services/:transaction_service_id',
  authenticateToken as any,
  getTransactionServiceById as any,
);
router.post('/transactions', authenticateToken as any, createOngoingTransaction as any);
router.put(
  '/transactions/:transaction_id/services',
  authenticateToken as any,
  addTransactionService as any,
);

export default router;
