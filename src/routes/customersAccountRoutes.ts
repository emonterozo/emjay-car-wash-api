import express from 'express';
import {
  register,
  login,
  verifyOtp,
  sendOtp,
  getCustomerWashPointsById,
  forgotPassword,
  forgotPasswordVerifyOtp,
  getTransactionsHistory,
} from '../controllers/customersAccountController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register as any);
router.post('/login', login as any);
router.post('/otp', sendOtp as any);
router.post('/otp/verify', verifyOtp as any);
router.get(
  '/:customer_id/wash-points-promos',
  authenticateToken as any,
  getCustomerWashPointsById as any,
);

router.post('/forgot/password', forgotPassword as any);
router.put('/forgot/password/verify', forgotPasswordVerifyOtp as any);
router.get('/:customer_id/transactions', authenticateToken as any, getTransactionsHistory as any);

export default router;
