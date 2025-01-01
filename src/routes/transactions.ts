import express from 'express';
import { getAllTransactionsController } from '../infrastructure/controllers/transactions';

const router = express.Router();

router.get('/', async (req, res) => {

  const limit = +(req.query.limit as string);
  const offset = +(req.query.offset as string);
  let query_order = JSON.parse((req.query?.order_by as string) ?? "{}");
  if (!query_order?.field || !query_order?.direction)
    query_order = undefined;

  const token = req.headers.authorization?.split(' ')[1] ?? ''
  const response = await getAllTransactionsController.handle(token);

  if (response.errors.length > 0) res.status(400);
  else res.status(200);

  res.send(response);
});

export default router;
