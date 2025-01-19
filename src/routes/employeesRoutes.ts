import express from 'express';
import { getAllEmployees, getEmployeeById } from '../controllers/employeesController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken as any, getAllEmployees as any);
router.get('/:employee_id', authenticateToken as any, getEmployeeById as any);

export default router;
