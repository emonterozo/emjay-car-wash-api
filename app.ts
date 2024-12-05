require('dotenv').config();
import 'module-alias/register';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// application routes
import homeRouter from '@routes/home';
import userRouter from '@routes/users';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

app.use('/home', homeRouter);
app.use('/user', userRouter);

app.get('/', (req, res) => {
  res.sendStatus(200);
});


export default app;