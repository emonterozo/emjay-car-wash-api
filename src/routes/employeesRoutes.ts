import express from 'express';
import {
  getAllEmployees,
  getEmployeeById,
  postEmployee,
  putEmployee,
} from '../controllers/employeesController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken as any, getAllEmployees as any);
router.get('/:employee_id', authenticateToken as any, getEmployeeById as any);
router.post('/add', authenticateToken as any, postEmployee as any);
router.put('/update/:employee_id', authenticateToken as any, putEmployee as any);

export default router;
