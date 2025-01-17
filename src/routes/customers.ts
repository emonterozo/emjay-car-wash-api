import express from 'express';
import {
  getAllCustomersController,
  getCustomerServicesController,
} from '../infrastructure/controllers/customers';
const router = express.Router();

// Get All entries route
router.get('/', async (req, res) => {
  const limit = +(req.query.limit as string);
  const offset = +(req.query.offset as string);
  let query_order = JSON.parse((req.query?.order_by as string) ?? '{}');
  if (!query_order?.field || !query_order?.direction) query_order = undefined;

  const token = req.headers.authorization?.split(' ')[1] ?? '';
  const customer_reponse = await getAllCustomersController.handle(token, {
    limit,
    offset,
    order_by: query_order,
  });

  res.send(customer_reponse);
});

// Get customer services by id
router.get('/:customer_id', async (req, res) => {
  const { customer_id } = req.params;
  const token = req.headers.authorization?.split(' ')[1] ?? '';
  const customer_reponse = await getCustomerServicesController.handle(token, customer_id);

  res.send(customer_reponse);
});

// Get one entry route
router.get('/:id', (req, res) => {
  res.send('Welcome to Home Router');
});

// Create route
router.post('/', (req, res) => {
  res.send('Customer Created Successfully');
});

router.delete('/:id', (req, res) => {
  res.send('Customer Deleted Successfully');
});

export default router;
