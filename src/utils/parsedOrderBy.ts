import { Request, Response } from 'express';
import { OrderBy } from '../common/types';

const sendValidationError = (res: Response, field: string, message: string) => {
  return res.status(400).json({
    data: null,
    errors: [
      {
        field,
        message,
      },
    ],
  });
};

export const parseOrderBy = (
  req: Request,
  res: Response,
  defaultField: string = 'registered_on',
  defaultDirection: 'asc' | 'desc' = 'desc',
): OrderBy | null => {
  const order_by = req.query.order_by as string;

  try {
    // Parse the order_by parameter if it's provided, else use defaults
    let order_by_object: OrderBy = order_by
      ? (JSON.parse(order_by) as OrderBy)
      : { field: defaultField, direction: defaultDirection };

    // Validate that the "field" and "direction" keys exist
    if (order_by_object.field === undefined) {
      sendValidationError(
        res,
        'order_by.field',
        'The "field" key is required within the "order_by" params',
      );
      return null;
    }

    if (order_by_object.direction === undefined) {
      sendValidationError(
        res,
        'order_by.direction',
        'The "direction" key is required within the "order_by" params',
      );
      return null;
    }

    // Ensure the "direction" is either "asc" or "desc"
    if (order_by_object.direction !== 'asc' && order_by_object.direction !== 'desc') {
      sendValidationError(
        res,
        'order_by.direction',
        'The "direction" key must be either "asc" or "desc".',
      );
      return null;
    }

    return order_by_object;
  } catch (error) {
    sendValidationError(
      res,
      'order_by',
      'Invalid "order_by" format. Ensure it is a valid stringify JSON object with "field" and "direction" keys.',
    );
    return null;
  }
};
