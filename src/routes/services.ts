import express from 'express';
import { get_all_services_controller } from '../infrastructure/controllers/services';

const router = express.Router();

router.get('/', async (req, res) => {
  const { limit, order_by, offset } = req.body;
  const token = req.headers.authorization?.split(' ')[1] ?? ''
  const response = await get_all_services_controller.handle(token, { limit, order_by, offset });

  if (response.errors.length > 0) res.status(400);
  else res.status(200);

  res.send(response);
});

export default router;
