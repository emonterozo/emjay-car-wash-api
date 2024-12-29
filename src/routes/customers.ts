import express from 'express';
import {
  getAllCustomersController,
  getCustomerServicesController,
} from '../infrastructure/controllers/customers';
const router = express.Router();

// Get All entries route
router.get('/', async (req, res) => {
  const { limit, offset, order_by } = req.body;
  const token = req.headers.authorization?.split(' ')[1] ?? ''
  const customer_reponse = await getAllCustomersController.handle(token, { limit, offset, order_by });

  res.send(customer_reponse);
});

// Get customer services by id
router.get('/:customer_id/services', async (req, res) => {
  const { customer_id } = req.params;
  const token = req.headers.authorization?.split(' ')[1] ?? ''
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
