import { Request, Response } from 'express';
import { DateRange } from '../common/types';
import { sendValidationError } from './sendValidationError';

export const parseDateRange = (req: Request, res: Response): DateRange | null => {
  const date_range = req.query.date_range as string;

  try {
    let date_range_object: DateRange = JSON.parse(date_range);

    if (date_range_object.start === undefined) {
      sendValidationError(
        res,
        'date_range.start',
        'The "start" key is required within the "date_range" params',
      );
      return null;
    }

    if (date_range_object.end === undefined) {
      sendValidationError(
        res,
        'date_range.end',
        'The "end" key is required within the "date_range" params',
      );
      return null;
    }

    if (isNaN(new Date(date_range_object.start).getTime())) {
      sendValidationError(
        res,
        'date_range.start',
        'The "start" key must be a valid string date & time value',
      );
      return null;
    }

    if (isNaN(new Date(date_range_object.end).getTime())) {
      sendValidationError(
        res,
        'date_range.end',
        'The "end" key must be a valid string date & time value',
      );
      return null;
    }

    const start = new Date(date_range_object.start);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date_range_object.end);
    end.setHours(23, 59, 59, 999);

    return {
      start,
      end,
    };
  } catch (error) {
    sendValidationError(
      res,
      'date_range',
      'Invalid "date_range" format. Ensure it is a valid stringify JSON object with "start" and "end" keys.',
    );
    return null;
  }
};
