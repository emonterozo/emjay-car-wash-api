import express from 'express';
import { getAllCustomers, getCustomerById } from '../controllers/customersController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken as any, getAllCustomers as any);
router.get('/:customer_id', authenticateToken as any, getCustomerById as any);

export default router;
