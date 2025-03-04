import { Request, Response } from 'express';
import * as customerUserService from '../services/customerUserService';

export const getTransactions = async (req: Request<{}, {}>, res: Response) => {
  try {
    const result = await customerUserService.getTransactions();

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
