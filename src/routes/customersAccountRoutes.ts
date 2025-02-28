import express from 'express';
import { register, login, verifyOtp, sendOtp } from '../controllers/customersAccountController';

const router = express.Router();

router.post('/register', register as any);
router.post('/login', login as any);
router.post('/otp', sendOtp as any);
router.post('/otp/verify', verifyOtp as any);

export default router;
