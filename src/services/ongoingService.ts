import mongoose from 'mongoose';
import Transaction from '../models/transactionModel';
import Service from '../models/serviceModel';
import Customer from '../models/customerModel';
import {
  PaginationOptionWithDateRange,
  OngoingTransactionProps,
  TransactionServiceProps,
  UpdateTransactionServiceProps,
  UpdateTransactionStatusProps,
} from '../common/types';
import { validateOngoingTransaction } from './validations/ongoingValidation';

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
      query.where('check_out').gte(start);
      // @ts-ignore
      query.where('check_out').lte(end);
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
      totalCountQuery.where('check_out').gte(start);
      // @ts-ignore
      totalCountQuery.where('check_out').lte(end);
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
        check_out: item.check_out,
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
        path: 'availed_services.service_id',
        select: 'title image',
      })
      .exec();
    const availed_services = document?.availed_services
      .filter((service) => service.service_id !== null)
      .map((service) => ({
        transaction_service_id: service._id.toString(),
        // @ts-ignore
        service_id: service.service_id?._id.toString(),
        // @ts-ignore
        title: service.service_id?.title,
        // @ts-ignore
        image: service.service_id?.image,
        price: service.price,
        status: service.status,
        is_free: service.is_free,
        is_paid: service.is_paid,
        discount: service.discount,
      }));

    if (document) {
      return {
        success: true,
        transaction: {
          id: document._id,
          contact_number: document.contact_number,
          vehicle_type: document.vehicle_type,
          vehicle_size: document.vehicle_size,
          model: document.model,
          plate_number: document.plate_number,
          availed_services,
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
    console.log(error);
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
        path: 'availed_services.service_id',
        select: 'title image',
      })
      .populate({
        path: 'availed_services.assigned_employee_id',
        select: 'first_name last_name gender',
      })
      .exec();
    const service = document?.availed_services.find(
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
          discount: service.discount,
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
        availed_services: [
          {
            service_id: new mongoose.Types.ObjectId(service_id),
            price,
            discount: 0,
            deduction: 0,
            company_earnings: price - employee_share,
            employee_share,
            assigned_employee_id: [],
            start_date: null,
            end_date: null,
            status: 'PENDING',
            is_free: service_charge === 'free',
            is_paid: service_charge === 'free',
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
    const availed_services = [...transaction?.availed_services.toObject()];
    availed_services.push({
      service_id: new mongoose.Types.ObjectId(service_id),
      price,
      deduction: 0,
      discount: 0,
      company_earnings: price - employee_share,
      employee_share,
      assigned_employee_id: [],
      start_date: null,
      end_date: null,
      status: 'PENDING',
      is_free: service_charge === 'free',
      is_paid: service_charge === 'free',
    });

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      {
        availed_services,
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

export const updateTransactionService = async (
  payload: UpdateTransactionServiceProps,
  transaction_id: string,
  transaction_service_id: string,
) => {
  // TODO: add handling if payload is not is follow the expected format
  const { status } = payload;
  let assigned_employee_id: mongoose.Types.ObjectId[] = [];
  if (payload.assigned_employee) {
    assigned_employee_id = payload.assigned_employee.map(
      (item) => new mongoose.Types.ObjectId(item),
    );
  }
  const deduction = Number(payload.deduction);
  const discount = Number(payload.discount);
  const is_free = payload.is_free;
  let is_paid = payload.is_paid;
  is_paid = is_free ? true : is_paid;

  try {
    const transaction = await Transaction.findById(transaction_id);
    // TODO: add handling if transaction_id is not valid object_id format, or transaction_id is not exist

    const availed_services = transaction?.availed_services.map((item) => {
      // TODO: add handling if transaction_service_id is not valid object_id format, or transaction_service_id is not exist
      if (item._id.toString() === transaction_service_id) {
        const profit = (item.price as number) - deduction;
        const employee_share = profit * 0.4;
        const company_earnings_computed_value = profit - employee_share - discount;
        const company_earnings =
          company_earnings_computed_value > 0 ? company_earnings_computed_value : 0;
        switch (status) {
          case 'CANCELLED':
          case 'PENDING':
            return {
              ...item.toObject(),
              deduction: status === 'PENDING' ? deduction : 0,
              discount: status === 'PENDING' ? discount : 0,
              company_earnings: status === 'PENDING' ? company_earnings : 0,
              employee_share: status === 'PENDING' ? employee_share : 0,
              assigned_employee_id: status === 'PENDING' ? assigned_employee_id : [],
              start_date: status === 'PENDING' ? null : new Date(),
              end_date: status === 'PENDING' ? null : new Date(),
              status,
              is_free: status === 'PENDING' ? is_free : false,
              is_paid: status === 'PENDING' ? is_paid : false,
            };
          default:
            return {
              ...item.toObject(),
              deduction,
              discount,
              company_earnings,
              employee_share,
              assigned_employee_id,
              status,
              start_date: status === 'ONGOING' ? new Date() : item.start_date,
              end_date:
                status === 'DONE' ? new Date() : status === 'ONGOING' ? null : item.end_date,
              is_free,
              is_paid,
            };
        }
      }

      return item;
    });

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      new mongoose.Types.ObjectId(transaction_id),
      {
        availed_services,
      },
    );

    if (updatedTransaction) {
      return {
        success: true,
        transaction_service: { id: transaction_service_id },
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

export const updateTransactionStatus = async (
  payload: UpdateTransactionStatusProps,
  transaction_id: string,
) => {
  const { status } = payload;
  try {
    const transaction = await Transaction.findById(transaction_id);

    if (transaction?.customer_id && status === 'COMPLETED') {
      const customer = await Customer.findById(transaction.customer_id);
      const done_services = transaction?.availed_services.filter((s) => s.status === 'DONE');

      const services = await Promise.all(
        done_services.map(async (availedService) => {
          const service = await Service.findById(availedService.service_id);
          const price = service?.price_list.find((item) => item.size === transaction.vehicle_size);

          return service
            ? {
                id: service._id,
                service: service.title,
                points: price?.points || 0,
                earning_points: price?.earning_points || 0,
                is_free: availedService.is_free,
              }
            : null;
        }),
      );

      const sorted_services = services
        .filter((service): service is NonNullable<typeof service> => service !== null)
        .sort((a, b) => (a.is_free ? 1 : 0) - (b.is_free ? 1 : 0));

      let customer_points = customer?.points || 0;
      let customerWashCount =
        transaction.vehicle_type === 'car'
          ? customer?.car_wash_service_count.find((item) => item.size === transaction.vehicle_size)
              ?.count || 0
          : customer?.moto_wash_service_count.find((item) => item.size === transaction.vehicle_size)
              ?.count || 0;

      // Update customer points
      sorted_services.forEach((service) => {
        customer_points = Math.max(
          0,
          customer_points + (service.is_free ? -service.points : service.earning_points),
        );
      });

      // Update wash count logic (Prevent negative wash count)
      sorted_services.forEach((service) => {
        const isCar = transaction.vehicle_type === 'car';
        if (isCar && service.service === 'Car Wash') {
          customerWashCount = Math.max(0, customerWashCount + (service.is_free ? -10 : 1));
        } else if (!isCar && ['Moto Wash', 'Hand Wax', 'Buff Wax'].includes(service.service)) {
          customerWashCount = Math.max(
            0,
            customerWashCount + (service.is_free && service.service === 'Moto Wash' ? -10 : 1),
          );
        }
      });

      // Update customer wash count object
      const updateWashCount = (wash_count: { size: string; count: number }[]) =>
        wash_count.map((item) =>
          item.size === transaction.vehicle_size
            ? { size: item.size, count: customerWashCount }
            : item,
        );

      await Customer.findByIdAndUpdate(transaction.customer_id, {
        points: customer_points,
        car_wash_service_count:
          transaction.vehicle_type === 'car'
            ? updateWashCount(customer?.car_wash_service_count!)
            : customer?.car_wash_service_count,
        moto_wash_service_count:
          transaction.vehicle_type !== 'car'
            ? updateWashCount(customer?.moto_wash_service_count!)
            : customer?.moto_wash_service_count,
      });
    }

    const availed_services = transaction?.availed_services.map((item) => ({
      ...item.toObject(),
      deduction: 0,
      company_earnings: 0,
      employee_share: 0,
      assigned_employee_id: [],
      end_date: new Date(),
      status,
      is_free: false,
      is_paid: false,
    }));

    const completed_services = transaction?.availed_services.map((item) => ({
      ...item.toObject(),
      is_paid: item.status === 'CANCELLED' ? item.is_paid : true,
    }));

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      new mongoose.Types.ObjectId(transaction_id),
      {
        status,
        check_out: new Date(),
        availed_services: status === 'CANCELLED' ? availed_services : completed_services,
      },
    );

    if (updatedTransaction) {
      return {
        success: true,
        transaction: { id: updatedTransaction?._id.toString() },
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
