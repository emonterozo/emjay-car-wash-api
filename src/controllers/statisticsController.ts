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
