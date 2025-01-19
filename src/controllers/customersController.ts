import { Request, Response } from 'express';
import { ListRequestBody, OrderBy } from '../common/types';
import { parseOrderBy } from '../utils/parsedOrderBy';
import * as customersService from '../services/customersService';

export const getAllCustomers = async (req: Request<{}, {}, ListRequestBody>, res: Response) => {
  const { offset, limit } = req.query;

  const order_by: OrderBy | null = parseOrderBy(req, res);
  const offset_number = parseInt(offset as string, 10) || 0;
  const limit_number = parseInt(limit as string, 10) || 0;

  if (!order_by) return;

  try {
    const result = await customersService.getAllCustomers({
      ...order_by,
      offset: offset_number,
      limit: limit_number,
    });

    if (result.success) {
      return res.status(200).json({
        data: {
          customers: result.customers,
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
          field: 'general',
          message: 'Something went wrong, please try again later',
        },
      ],
    });
  }
};
export const getCustomerById = async (req: Request<{ customer_id: string }>, res: Response) => {
  const { customer_id } = req.params;

  try {
    const result = await customersService.getCustomerById(customer_id);

    if (result.success) {
      return res.status(200).json({
        data: {
          customer: result.customer,
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
          field: 'general',
          message: 'Something went wrong, please try again later',
        },
      ],
    });
  }
};

export const getCustomerWashCountById = async (
  req: Request<{ customer_id: string }>,
  res: Response,
) => {
  const { customer_id } = req.params;

  try {
    const result = await customersService.getCustomerWashCountById(customer_id);

    if (result.success) {
      return res.status(200).json({
        data: {
          customer: result.customer,
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
          field: 'general',
          message: 'Something went wrong, please try again later',
        },
      ],
    });
  }
};
