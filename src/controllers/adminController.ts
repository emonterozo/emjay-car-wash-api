import { Request, Response } from 'express';
import { authenticateUser } from '../services/adminService';
import { Error } from '../common/types';

interface LoginRequestBody {
  username: string;
  password: string;
}

export const login = async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
  const { username, password } = req.body;

  const validationErrors: Error[] = [];

  if (!username) {
    validationErrors.push({ field: 'username', message: 'Username is required' });
  }

  if (!password) {
    validationErrors.push({ field: 'password', message: 'Password is required' });
  }

  if (validationErrors.length > 0) {
    return res.status(400).json({
      data: null,
      errors: validationErrors,
    });
  }

  try {
    const result = await authenticateUser(username, password);

    if (result.success) {
      return res.status(200).json({
        data: {
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
        errors: [],
      });
    } else {
      return res.status(result.status!).json({
        data: null,
        errors: [result.errors],
      });
    }
  } catch (error) {
    return res.status(500).json({
      data: null,
      errors: [
        {
          field: 'general',
          message: 'Something went wrong, please try again later',
        },
      ],
    });
  }
};
