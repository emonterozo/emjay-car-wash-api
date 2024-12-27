import express from 'express';
import { createUserController } from '../infrastructure/api/users/index';
import { CreateUserControllerInput } from '../interfaces/controllers/ICreateUserController';
const router = express.Router();

router.post('/', async (req, res) => {
  if (!req.body.username) {
    res.send({
      data: null,
      errors: [{ message: 'username is required', field: 'username' }],
    });
    return;
  }

  if (!req.body.password) {
    res.send({
      data: null,
      errors: [{ message: 'password is required', field: 'password' }],
    });
    return;
  }

  if (!req.body.type) {
    res.send({
      data: null,
      errors: [{ message: 'type is required', field: 'type' }],
    });
    return;
  }

  const { type, username, password } = req.body;
  const user_input_sample: CreateUserControllerInput = {
    Type: type,
    Password: password,
    Username: username,
  };
  const response = await createUserController.handle(user_input_sample);

  if (response.errors.length > 0) res.status(400).send(response);
  else res.status(200).send(response);
});

export default router;
