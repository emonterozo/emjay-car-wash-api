import { Request, Response } from 'express';
import * as ongoingService from '../services/ongoingService';
import { DateRange, ListRequestBody, OrderBy } from '../common/types/listRequestBody';
import { parseOrderBy } from '../utils/parseOrderBy';
import { parseDateRange } from '../utils/parseDateRange';
import { OngoingTransactionProps, TransactionServiceProps } from '../common/types';

interface GetTransactionsProps extends ListRequestBody {
  status?: string;
}

export const getTransactions = async (
  req: Request<{}, {}, GetTransactionsProps>,
  res: Response,
) => {
  const { offset, limit, status } = req.query;

  const order_by: OrderBy | null = parseOrderBy(req, res, 'check_in');
  const date_range: DateRange | null = req.query?.date_range ? parseDateRange(req, res) : null;
  const offset_number = parseInt(offset as string, 10) || 0;
  const limit_number = parseInt(limit as string, 10) || 0;

  try {
    const result = await ongoingService.getTransactions({
      ...order_by!,
      offset: offset_number,
      limit: limit_number,
      date_range: date_range === null ? undefined : date_range,
      status: status as string,
    });

    if (result.success) {
      return res.status(200).json({
        data: {
          transaction: result.transactions,
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

export const getTransactionServicesById = async (
  req: Request<{ transaction_id: string }>,
  res: Response,
) => {
  const { transaction_id } = req.params;

  try {
    const result = await ongoingService.getTransactionServicesById(transaction_id);

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

export const getTransactionServiceById = async (
  req: Request<{ transaction_id: string; transaction_service_id: string }>,
  res: Response,
) => {
  const { transaction_id, transaction_service_id } = req.params;

  try {
    const result = await ongoingService.getTransactionServiceById(
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

export const createOngoingTransaction = async (
  req: Request<{}, {}, OngoingTransactionProps>,
  res: Response,
) => {
  const result = await ongoingService.createOngoingTransaction(req.body);

  if (result.success) {
    return res.status(201).json({
      data: {
        ongoing: result.ongoing,
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

export const addTransactionService = async (
  req: Request<{ transaction_id: string }, {}, TransactionServiceProps>,
  res: Response,
) => {
  const result = await ongoingService.addTransactionService(req.body, req.params.transaction_id);
  if (result.success) {
    return res.status(200).json({
      data: {
        transaction_service: result.transaction_service,
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
