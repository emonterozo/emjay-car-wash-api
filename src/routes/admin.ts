import express from 'express';
import { adminLoginController } from "src/infrastructure/controllers/auth/index";

const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username) {
        res.send({ data: null, errors: [{ message: "username is required", field: "username" }] });
        return;
    }

    if (!password) {
        res.send({ data: null, errors: [{ message: "password is required", field: "password" }] });
        return;
    }

    const response = await adminLoginController.handle({ username, password });
    res.send(response);
});

export default router;
