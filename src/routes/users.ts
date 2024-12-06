import express from 'express';
import { createUserController } from "../../src/infrastructure/api/users/index";
const router = express.Router();

router.get('/create', async (req, res) => {
    const user_input_sample = {
        FirstName: 'John',
        LastName: 'Doe',
        Email: 'V7o0H@example.com',
        Password: 'password'
    }
    const response = await createUserController.handle(user_input_sample)
    res.send(response);
});

export default router;
