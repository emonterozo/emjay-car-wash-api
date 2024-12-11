import express from 'express';
import { createUserController } from "src/infrastructure/api/users/index";
import { CreateUserControllerInput } from 'src/interfaces/controllers/ICreateUserController';
const router = express.Router();

router.post('/create', async (req, res) => {
    if (!req.body.username) {
        res.send({ 
            data: null, 
            errors: [{ message: "username is required", field: "username" }]
        });
        return;
    }

    if (!req.body.password) {
        res.send({ 
            data: null, 
            errors: [{ message: "password is required", field: "password" }]
        });
        return;
    }

    if (!req.body.type) {
        res.send({ 
            data: null, 
            errors: [{ message: "type is required", field: "type" }]
        });
        return;
    }

    const { type, username, password } = req.body
    const user_input_sample: CreateUserControllerInput = {
        Type: type,
        Password: password,
        Username: username
    }
    const response = await createUserController.handle(user_input_sample)
    res.send(response);
});

export default router;
