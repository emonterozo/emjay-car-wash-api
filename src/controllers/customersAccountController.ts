import { Request, Response } from 'express';
import { AddCustomerProps } from '../common/types';
import * as customersAccountService from '../services/customersAccountService';

export const register = async (req: Request<{}, {}, AddCustomerProps>, res: Response) => {
  const result = await customersAccountService.register(req.body);
  if (result.success) {
    return res.status(201).json({
      data: {
        user: result.user,
      },
      errors: [],
    });
  } else {
    return res.status(result.status!).json({
      data: null,
      errors: result.errors,
    });
  }
};

export const login = async (
  req: Request<{}, {}, { username: string; password: string }>,
  res: Response,
) => {
  const { username, password } = req.body;

  try {
    const result = await customersAccountService.login(username, password);

    if (result.success) {
      if (result.accessToken) {
        return res.status(200).json({
          data: {
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
          },
          errors: [],
        });
      } else {
        return res.status(201).json({
          data: {
            user: result.user,
          },
          errors: [],
        });
      }
    } else {
      return res.status(result.status!).json({
        data: null,
        errors: [result.error],
      });
    }
  } catch (error) {
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

export const verifyOtp = async (
  req: Request<{}, {}, { user: string; otp: string }>,
  res: Response,
) => {
  const { user, otp } = req.body;

  try {
    const result = await customersAccountService.verifyOtp(user, parseInt(otp, 10));

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
        errors: [result.error],
      });
    }
  } catch (error) {
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

export const forgotPassword = async (
  req: Request<{}, {}, { username: string; password: string }>,
  res: Response,
) => {
  const { username, password } = req.body;

  try {
    const result = await customersAccountService.forgotPassword(username, password);

    if (result.success) {
      return res.status(200).json({
        data: {
          user: result.user,
        },
        errors: [],
      });
    } else {
      return res.status(result.status!).json({
        data: null,
        errors: [result.error],
      });
    }
  } catch (error) {
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

export const sendOtp = async (req: Request<{}, {}, { user: string }>, res: Response) => {
  const { user } = req.body;

  try {
    const result = await customersAccountService.sendOtp(user);

    if (result.success) {
      return res.status(201).json({
        data: {
          user: result.user,
        },
        errors: [],
      });
    } else {
      return res.status(result.status!).json({
        data: null,
        errors: [result.error],
      });
    }
  } catch (error) {
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
