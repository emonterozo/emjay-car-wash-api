import express from 'express';
import { getAllServices } from '../controllers/servicesController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken as any, getAllServices as any);

export default router;
