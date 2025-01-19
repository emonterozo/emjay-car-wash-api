import express from 'express';
import { login } from '../controllers/adminController';

const router = express.Router();

router.post('/login', login as any);

export default router;
