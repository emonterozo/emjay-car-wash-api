require('dotenv').config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import connectDB from './src/config/db';
// application routes
import AdminRouter from './src/routes/adminRoutes';
import CustomersRouter from './src/routes/customersRoutes';
import ServicesRouter from './src/routes/servicesRouter';

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

app.use('/admin', AdminRouter);
app.use('/admin/customers', CustomersRouter);
app.use('/services', ServicesRouter);

app.get('/', (req, res) => {
  res.sendStatus(200);
});

export default app;
