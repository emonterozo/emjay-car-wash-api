import { Request, Response } from 'express';
import { ListRequestBody, OrderBy } from '../common/types';
import { parseOrderBy } from '../utils/parsedOrderBy';
import * as servicesService from '../services/servicesService';

export const getAllServices = async (req: Request<{}, {}, ListRequestBody>, res: Response) => {
  const { offset, limit } = req.query;

  const order_by: OrderBy | null = parseOrderBy(req, res, 'ratings');
  const offset_number = parseInt(offset as string, 10) || 0;
  const limit_number = parseInt(limit as string, 10) || 0;

  if (!order_by) return;

  try {
    const result = await servicesService.getAllServices({
      ...order_by,
      offset: offset_number,
      limit: limit_number,
    });

    if (result.success) {
      return res.status(200).json({
        data: {
          services: result.services,
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
