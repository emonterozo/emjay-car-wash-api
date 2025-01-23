import mongoose from 'mongoose';
import Transaction from '../models/transactionModel';
import {
  PaginationOptionWithDateRange,
  OngoingTransactionProps,
  TransactionServiceProps,
} from '../common/types';
import { validateOngoingTransaction } from './validations/ongoingValidation';
import Service from '../models/serviceModel';

interface GetTransactionsProps extends PaginationOptionWithDateRange {
  status?: string;
}

export const getTransactions = async (option: GetTransactionsProps) => {
  try {
    const { field, direction, limit, offset, date_range, status } = option;
    const query = Transaction.find();

    if (date_range) {
      const { start, end } = date_range;
      // @ts-ignore
      query.where('check_in').gte(start);
      // @ts-ignore
      query.where('check_in').lte(end);
    }

    if (status) {
      query.where('status').equals(status.toUpperCase());
    }

    query.sort({ [field]: direction });

    query.populate({
      path: 'customer_id',
      select: 'first_name last_name',
    });

    if (limit > 0) query.limit(limit);
    if (offset > 0) query.skip(offset);

    const data = await query;

    const totalCountQuery = Transaction.find();
    if (date_range) {
      const { start, end } = date_range;

      // @ts-ignore
      totalCountQuery.where('check_in').gte(start);
      // @ts-ignore
      totalCountQuery.where('check_in').lte(end);
    }

    if (status) {
      totalCountQuery.where('status').equals(status.toUpperCase());
    }

    const totalCount = await totalCountQuery.countDocuments();

    const transactions = data.map((item) => {
      return {
        id: item._id.toString(),
        model: item.model,
        plate_number: item.plate_number,
        check_in: item.check_in,
        // @ts-ignore
        customer_id: item.customer_id?._id ?? null,
        // @ts-ignore
        first_name: item.customer_id?.first_name ?? 'EmJay',
        // @ts-ignore
        last_name: item.customer_id?.last_name ?? 'Customer',
        status: item.status,
      };
    });

    return {
      success: true,
      transactions,
      totalCount,
    };
  } catch (error: any) {
    return {
      success: false,
      status: 500,
      error: {
        field: 'unknown',
        message: 'An unexpected error occurred',
      },
    };
  }
};

export const getTransactionServicesById = async (transaction_id: string) => {
  try {
    const document = await Transaction.findById(transaction_id)
      .populate({
        path: 'services.service_id',
        select: 'title image',
      })
      .exec();
    const services = document?.services
      .filter((service) => service.service_id !== null)
      .map((service) => ({
        transaction_service_id: service._id.toString(),
        // @ts-ignore
        service_id: service.service_id?._id.toString(),
        // @ts-ignore
        title: service.service_id?.title,
        // @ts-ignore
        image: service.service_id?.image,
        status: service.status,
        is_free: service.is_free,
      }));

    if (document) {
      return {
        success: true,
        transaction: {
          id: document._id,
          customer_id: document.customer_id ?? null,
          services,
        },
      };
    }

    return {
      success: false,
      status: 404,
      error: {
        field: 'transaction_id',
        message: 'Transaction does not exist',
      },
    };
  } catch (error: any) {
    return {
      success: false,
      status: 500,
      error: {
        field: 'unknown',
        message: 'An unexpected error occurred',
      },
    };
  }
};

export const getTransactionServiceById = async (
  transaction_id: string,
  transaction_service_id: string,
) => {
  try {
    const document = await Transaction.findById(transaction_id)
      .populate({
        path: 'services.service_id',
        select: 'title image',
      })
      .populate({
        path: 'services.assigned_employee_id',
        select: 'first_name last_name gender',
      })
      .exec();
    const service = document?.services.find(
      (service) => service._id.toString() === transaction_service_id,
    );

    if (!service) {
      return {
        success: false,
        status: 404,
        error: {
          field: 'transaction_service_id',
          message: 'Transaction service does not exist',
        },
      };
    }

    const assigned_employees = service.assigned_employee_id.map((item) => {
      const { _id, ...object } = item.toObject();

      return {
        ...object,
        id: _id.toString(),
      };
    });

    if (document) {
      return {
        success: true,
        transaction: {
          id: document._id.toString(),
          transaction_service_id: service._id.toString(),
          // @ts-ignore
          image: service.service_id?.image,
          // @ts-ignore
          title: service.service_id?.title,
          price: service.price,
          deduction: service.deduction,
          company_earnings: service.company_earnings,
          employee_share: service.employee_share,
          status: service.status,
          is_free: service.is_free,
          is_paid: service.is_paid,
          start_date: service.start_date,
          end_date: service.end_date,
          assigned_employees,
        },
      };
    }

    return {
      success: false,
      status: 404,
      error: {
        field: 'transaction_id',
        message: 'Transaction does not exist',
      },
    };
  } catch (error: any) {
    return {
      success: false,
      status: 500,
      error: {
        field: 'unknown',
        message: 'An unexpected error occurred',
      },
    };
  }
};

export const createOngoingTransaction = async (payload: OngoingTransactionProps) => {
  const validationErrors = validateOngoingTransaction({ type: 'Transaction', payload });
  if (validationErrors.length > 0) {
    return {
      success: false,
      status: 400,
      errors: validationErrors,
    };
  }
  try {
    const { vehicle_type, vehicle_size, model, plate_number, service_id, service_charge } = payload;

    const price = parseInt(payload.price, 10);
    const employee_share = price * 0.4;

    const service = await Service.findById(service_id).exec();

    if (service) {
      const savedTransaction = await Transaction.create({
        customer_id: payload.customer_id ? new mongoose.Types.ObjectId(payload.customer_id) : null,
        vehicle_type,
        vehicle_size,
        model,
        plate_number,
        contact_number: payload.contact_number ?? null,
        status: 'ONGOING',
        check_in: new Date(),
        check_out: null,
        services: [
          {
            service_id: new mongoose.Types.ObjectId(service_id),
            price,
            deduction: 0,
            company_earnings: service_charge === 'free' ? 0 : price - employee_share,
            employee_share,
            assigned_employee_id: [],
            start_date: null,
            end_date: null,
            status: 'PENDING',
            is_free: service_charge === 'free',
            is_paid: service_charge === 'free',
            is_claimed: false,
          },
        ],
      });
      return {
        success: true,
        ongoing: { id: savedTransaction._id.toString() },
      };
    }

    return {
      success: false,
      status: 404,
      errors: [{ field: 'service_id', message: 'Service does not exist' }],
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      errors: [{ field: 'unknown', message: 'An unexpected error occurred' }],
    };
  }
};

export const addTransactionService = async (payload: TransactionServiceProps, id: string) => {
  const validationErrors = validateOngoingTransaction({ type: 'Transaction Service', payload });
  if (validationErrors.length > 0) {
    return {
      success: false,
      status: 400,
      errors: validationErrors,
    };
  }
  try {
    const { service_id, service_charge } = payload;
    const price = parseInt(payload.price, 10);
    const employee_share = price * 0.4;

    const transaction = await Transaction.findById(id);
    const services = [...transaction?.services.toObject()];
    services.push({
      service_id: new mongoose.Types.ObjectId(service_id),
      price,
      deduction: 0,
      company_earnings: service_charge === 'free' ? 0 : price - employee_share,
      employee_share,
      assigned_employee_id: [],
      start_date: null,
      end_date: null,
      status: 'PENDING',
      is_free: service_charge === 'free',
      is_paid: service_charge === 'free',
      is_claimed: false,
    });

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      {
        services,
      },
    );

    if (updatedTransaction) {
      return {
        success: true,
        transaction_service: { id: updatedTransaction?._id.toString() },
      };
    }

    return {
      success: false,
      status: 404,
      errors: [
        {
          field: 'transaction_id',
          message: 'Transaction does not exist',
        },
      ],
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      errors: [{ field: 'unknown', message: 'An unexpected error occurred' }],
    };
  }
};
