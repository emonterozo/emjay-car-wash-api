import { Request, Response } from 'express';
import { ListRequestBody, OrderBy } from '../common/types';
import { parseOrderBy } from '../utils/parseOrderBy';
import * as consumablesService from '../services/consumablesService';
import { AddConsumableProps } from 'src/common/types/consumableService';

export const getAllConsumables = async (req: Request<{}, {}, ListRequestBody>, res: Response) => {
  const { offset, limit } = req.query;

  const order_by: OrderBy | null = parseOrderBy(req, res, 'ratings');
  const offset_number = parseInt(offset as string, 10) || 0;
  const limit_number = parseInt(limit as string, 10) || 0;

  if (!order_by) return;

  try {
    const result = await consumablesService.getAllConsumables({
      ...order_by,
      offset: offset_number,
      limit: limit_number,
    });

    if (result.success) {
      return res.status(200).json({
        data: {
          consumables: result.consumables,
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

export const postConsumable = async (req: Request<{}, {}, AddConsumableProps>, res: Response) => {
  const result = await consumablesService.postConsumable(req.body);

  if (result.success) {
    return res.status(201).json({
      data: {
        consumable: result.consumable,
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

export const deleteConsumableById = async (
  req: Request<{ consumable_id: string }>,
  res: Response,
) => {
  const { consumable_id } = req.params;

  try {
    const result = await consumablesService.deleteConsumableById(consumable_id);

    if (result.success) {
      return res.status(200).json({
        data: {
          consumable: result.consumable,
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
