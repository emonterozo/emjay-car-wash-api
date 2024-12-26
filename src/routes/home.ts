import express from 'express';
import { createUserController } from 'src/infrastructure/api/users/index';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Welcome to Home Router');
});

export default router;
