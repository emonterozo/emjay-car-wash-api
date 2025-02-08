require('dotenv').config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import connectDB from './src/config/db';
// application routes
import AdminRouter from './src/routes/adminRoutes';
import CustomersRouter from './src/routes/customersRoutes';
import ServicesRouter from './src/routes/servicesRoutes';
import EmployeesRouter from './src/routes/employeesRoutes';
import OngoingRouter from './src/routes/ongoingRoutes';
import TransactionsRouter from './src/routes/transactionsRoutes';
import ConsumablesRouter from './src/routes/consumablesRoute';

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

app.use('/admin', AdminRouter);
app.use('/admin/customers', CustomersRouter);
app.use('/admin/employees', EmployeesRouter);
app.use('/admin/ongoing', OngoingRouter);
app.use('/admin/transactions', TransactionsRouter);
app.use('/admin/consumables', ConsumablesRouter);
app.use('/services', ServicesRouter);

app.get('/', (req, res) => {
  res.sendStatus(200);
});

export default app;
