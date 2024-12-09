import express from 'express';
import { adminLoginController } from "src/infrastructure/controllers/auth/index";

const router = express.Router();

router.get('/login', async (req, res) => {
    const response = await adminLoginController.handle({ username: 'emjay', password: 'password' });
    res.send(response);
});

export default router;
