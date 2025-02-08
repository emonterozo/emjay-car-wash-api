import express from 'express';
import {
  getAllConsumables,
  postConsumable,
  deleteConsumableById,
} from '../controllers/consumablesController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken as any, getAllConsumables as any);
router.post('/', authenticateToken as any, postConsumable as any);
router.delete('/:consumable_id', authenticateToken as any, deleteConsumableById as any);

export default router;
