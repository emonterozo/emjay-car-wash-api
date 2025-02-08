import { Request, Response } from 'express';
import { ListRequestBody, OrderBy, AddExpenseProps, DateRange } from '../common/types';
import { parseOrderBy } from '../utils/parseOrderBy';
import * as expensesService from '../services/expensesService';
import { parseDateRange } from '../utils/parseDateRange';

export const getAllExpenses = async (req: Request<{}, {}, ListRequestBody>, res: Response) => {
  const { offset, limit } = req.query;

  const order_by: OrderBy | null = parseOrderBy(req, res, 'date');
  const date_range: DateRange | null = req.query?.date_range ? parseDateRange(req, res) : null;
  const offset_number = parseInt(offset as string, 10) || 0;
  const limit_number = parseInt(limit as string, 10) || 0;

  if (!order_by) return;

  try {
    const result = await expensesService.getAllExpenses({
      ...order_by,
      offset: offset_number,
      limit: limit_number,
      date_range: date_range === null ? undefined : date_range,
    });

    if (result.success) {
      return res.status(200).json({
        data: {
          expenses: result.expenses,
          totalCount: result.totalCount,
        },
        errors: [],
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

export const postExpense = async (req: Request<{}, {}, AddExpenseProps>, res: Response) => {
  const result = await expensesService.postExpense(req.body);

  if (result.success) {
    return res.status(201).json({
      data: {
        expense: result.expense,
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
