import { Request, Response } from 'express';
import mongoose from 'mongoose';
import * as transactionsService from '../services/transactionsService';
import { DateRange } from '../common/types/listRequestBody';
import { parseDateRange } from '../utils/parseDateRange';

export const getTransactions = async (req: Request<{}, {}, DateRange>, res: Response) => {
  try {
    const date_range = parseDateRange(req, res);
    const result = await transactionsService.getTransactions({
      start: date_range?.start!,
      end: date_range?.end!,
    });

    if (result.success) {
      return res.status(200).json({
        data: {
          summary: result.summary,
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

export const getTransactionDetailsById = async (
  req: Request<{ transaction_id: string; transaction_service_id: string }>,
  res: Response,
) => {
  const { transaction_id, transaction_service_id } = req.params;

  try {
    const result = await transactionsService.getTransactionDetailsById(
      transaction_id,
      transaction_service_id,
    );

    if (result.success) {
      return res.status(200).json({
        data: {
          transaction: result.transaction,
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

export const getTransactionComputation = async (req: Request<{}, {}, DateRange>, res: Response) => {
  try {
    const date_range = parseDateRange(req, res);
    const { employee_id } = req.query;

    let assigned_employee_id: mongoose.Types.ObjectId[] = [];
    //@ts-ignore
    const employee: string[] = employee_id.split(',');
    assigned_employee_id = employee.map((item) => new mongoose.Types.ObjectId(item));

    const result = await transactionsService.getTransactionComputation({
      start: date_range?.start!,
      end: date_range?.end!,
      employee_id: assigned_employee_id,
    });

    if (result.success) {
      return res.status(200).json({
        data: {
          summary: result.summary,
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
