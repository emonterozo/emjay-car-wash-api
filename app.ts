require('dotenv').config();
import 'module-alias/register';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// application routes
import homeRouter from './src/routes/home';
import userRouter from './src/routes/users';
import AdminRouter from './src/routes/admin';
import CustomersRouter from './src/routes/customers';
import ServicesRouter from './src/routes/services';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

app.use('/home', homeRouter);
// app.use('/users', userRouter);
// app.use('/admin', AdminRouter);
// app.use('/customers', CustomersRouter);
// app.use('/services', ServicesRouter);

app.get('/', (req, res) => {
  res.sendStatus(200);
});

export default app;
