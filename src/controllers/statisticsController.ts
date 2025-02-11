import { Request, Response } from 'express';
import * as statisticsService from '../services/statisticsService';
import { DateRange } from '../common/types/listRequestBody';
import { parseDateRange } from '../utils/parseDateRange';

export const getCurrentWeekSales = async (req: Request<{}, {}, DateRange>, res: Response) => {
  try {
    const date_range = parseDateRange(req, res);
    const result = await statisticsService.getCurrentWeekSales({
      start: date_range?.start!,
      end: date_range?.end!,
    });

    if (result.success) {
      return res.status(200).json({
        data: {
          results: result.results,
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

export const getSalesStatistics = async (
  req: Request<
    {},
    {},
    {
      filter: 'daily' | 'weekly' | 'monthly' | 'yearly';
      end: Date;
    }
  >,
  res: Response,
) => {
  try {
    const result = await statisticsService.getSalesStatistics(
      req.query.filter as 'daily' | 'weekly' | 'monthly' | 'yearly',
      new Date(req.query.end as string),
    );

    if (result.success) {
      return res.status(200).json({
        data: {
          income: result.income,
          expenses: result.expenses,
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
