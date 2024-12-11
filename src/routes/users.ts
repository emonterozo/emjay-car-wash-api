import express from 'express';
import { createUserController } from "src/infrastructure/api/users/index";
import { CreateUserControllerInput } from 'src/interfaces/controllers/ICreateUserController';
const router = express.Router();

router.get('/create', async (req, res) => {
    const user_input_sample: CreateUserControllerInput = {
        Type: 'SUPERVISOR',
        Password: 'password',
        Username: 'emjay_supervisor'
    }
    const response = await createUserController.handle(user_input_sample)
    res.send(response);
});

export default router;
