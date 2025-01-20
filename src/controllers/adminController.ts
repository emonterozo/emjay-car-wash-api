import { Request, Response } from 'express';
import { authenticateUser } from '../services/adminService';
import { Error } from '../common/types';
import { logWithContext } from '../logs/logger';

interface LoginRequestBody {
  username: string;
  password: string;
}

export const login = async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
  const { username, password } = req.body;

  const validationErrors: Error[] = [];

  logWithContext({
    level: 'info',
    message: 'Admin login attempt',
    req,
    file: 'adminController.login',
    data: { username },
    errors: [],
  });

  if (!username) {
    validationErrors.push({ field: 'username', message: 'Username is required' });
  }

  if (!password) {
    validationErrors.push({ field: 'password', message: 'Password is required' });
  }

  if (validationErrors.length > 0) {
    logWithContext({
      level: 'error',
      message: 'Admin login failure, missing field',
      req,
      file: 'adminController.login',
      data: { username },
      errors: validationErrors,
    });

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
      logWithContext({
        level: 'error',
        message: 'Admin login failure',
        req,
        file: 'adminController.login',
        data: { username },
        errors: [result.error],
      });
      return res.status(result.status!).json({
        data: null,
        errors: [result.error],
      });
    }
  } catch (error) {
    logWithContext({
      level: 'error',
      message: 'Admin login failure',
      req,
      file: 'adminController.login',
      data: { username },
      errors: error,
    });
    return res.status(500).json({
      data: null,
      errors: [
        {
          field: 'unknown',
          message: 'Something went wrong, please try again later',
        },
      ],
    });
  }
};
