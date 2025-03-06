import { Request, Response } from 'express';
import { AddCustomerProps, DateRange } from '../common/types';
import * as customersAccountService from '../services/customersAccountService';
import { parseDateRange } from '../utils/parseDateRange';

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

export const getCustomerWashPointsById = async (
  req: Request<{ customer_id: string }>,
  res: Response,
) => {
  const { customer_id } = req.params;

  try {
    const result = await customersAccountService.getCustomerWashPointsById(customer_id);

    if (result.success) {
      return res.status(200).json({
        data: {
          customer: result.customer,
          promos: result.promos,
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

export const forgotPassword = async (req: Request<{}, {}, { username: string }>, res: Response) => {
  const { username } = req.body;
  const result = await customersAccountService.forgotPassword(username);
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

export const forgotPasswordVerifyOtp = async (
  req: Request<{}, {}, { user: string; otp: string; password: string }>,
  res: Response,
) => {
  const { user, otp, password } = req.body;

  try {
    const result = await customersAccountService.forgotPasswordVerifyOtp(
      user,
      parseInt(otp, 10),
      password,
    );

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

export const getTransactionsHistory = async (
  req: Request<{ customer_id: string }, {}, DateRange>,
  res: Response,
) => {
  const { customer_id } = req.params;
  const date_range = parseDateRange(req, res);

  try {
    const result = await customersAccountService.getTransactionsHistory(customer_id, date_range!);

    if (result.success) {
      return res.status(200).json({
        data: {
          transactions: result.transactions,
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
