import express from 'express';
import {
  getAllCustomersController,
  getCustomerServicesController,
} from '../infrastructure/controllers/customers';
const router = express.Router();

// Get All entries route
router.get('/', async (req, res) => {
  const customer_reponse = await getAllCustomersController.handle();

  res.send(customer_reponse);
});

// Get customer services by id
router.get('/:customer_id/services', async (req, res) => {
  const { customer_id } = req.params;
  const customer_reponse = await getCustomerServicesController.handle(customer_id);

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
