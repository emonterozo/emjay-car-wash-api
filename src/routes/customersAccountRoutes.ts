import express from 'express';
import {
  register,
  login,
  verifyOtp,
  sendOtp,
  getCustomerWashPointsById,
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

export default router;
