import mongoose from 'mongoose';
import Transaction from '../models/transactionModel';
import { PaginationOptionWithDateRange } from '../common/types';

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

export interface OngoingTransactionProps {
  customer_id?: string;
  vehicle_type: string;
  vehicle_size: string;
  model: string;
  plate_number: string;
  contact_number?: string;
  service_id: string;
  price: string;
  service_charge: string;
}

export interface TransactionServiceProps {
  service_id: string;
  price: string;
  service_charge: string;
}

const validVehicleType = ['car', 'motorcycle'];
const validVehicle = {
  car: ['sm', 'md', 'lg', 'xl', 'xxl'],
  motorcycle: ['sm', 'md', 'lg'],
};
const validServiceCharge = ['free', 'not free'];

export function validate(payload: OngoingTransactionProps) {
  const validationErrors: { field: string; message: string }[] = [];
  const contactNumberRegex = /^09\d{9}$/;

  const fields = [
    {
      field: 'vehicle_type',
      value: payload.vehicle_type,
      message: 'Vehicle type is required',
      maxLength: 10,
    },
    {
      field: 'vehicle_size',
      value: payload.vehicle_size,
      message: 'Vehicle size is required',
      maxLength: 3,
    },
    {
      field: 'model',
      value: payload.model,
      message: 'Model is required',
      maxLength: 64,
    },
    {
      field: 'plate_number',
      value: payload.plate_number,
      message: 'Plate number is required',
      maxLength: 15,
    },
    {
      field: 'service_id',
      value: payload.service_id,
      message: 'Service id is required',
      maxLength: 24,
    },
    {
      field: 'price',
      value: payload.price,
      message: 'Price is required',
      maxLength: 10,
    },
    {
      field: 'service_charge',
      value: payload.service_charge,
      message: 'Service charge is required',
      maxLength: 10,
    },
  ];

  fields.forEach(({ field, value, message, maxLength }) => {
    if (value) {
      if (value.length > maxLength) {
        validationErrors.push({
          field,
          message: `${field.replace('_', ' ').charAt(0).toUpperCase() + field.replace('_', ' ').slice(1)} cannot exceed ${maxLength} characters`,
        });
      }
    } else {
      validationErrors.push({ field, message });
    }
  });

  if (payload.customer_id && !mongoose.Types.ObjectId.isValid(payload.customer_id)) {
    validationErrors.push({
      field: 'customer_id',
      message: 'Customer id must be a 24-character hexadecimal string',
    });
  }

  if (!validVehicleType.includes(payload.vehicle_type)) {
    validationErrors.push({
      field: 'vehicle_type',
      message: `Vehicle type must be one of ${validVehicleType.join(', ')}`,
    });
  }

  if (payload.vehicle_type === 'car' && !validVehicle.car.includes(payload.vehicle_size)) {
    validationErrors.push({
      field: 'vehicle_size',
      message: `Vehicle size car must be one of ${validVehicle.car.join(', ')}`,
    });
  }

  if (
    payload.vehicle_type === 'motorcycle' &&
    !validVehicle.motorcycle.includes(payload.vehicle_size)
  ) {
    validationErrors.push({
      field: 'vehicle_size',
      message: `Vehicle size for motorcycle must be one of ${validVehicle.motorcycle.join(', ')}`,
    });
  }

  if (payload.contact_number && !contactNumberRegex.test(payload.contact_number)) {
    validationErrors.push({
      field: 'contact_number',
      message: 'Contact number must be in the format 09123456789',
    });
  }

  if (!mongoose.Types.ObjectId.isValid(payload.service_id)) {
    validationErrors.push({
      field: 'service_id',
      message: 'Service id must be a 24-character hexadecimal string',
    });
  }

  if (isNaN(parseInt(payload.price, 10))) {
    validationErrors.push({
      field: 'price',
      message: 'Price must be a valid number',
    });
  }

  if (!validServiceCharge.includes(payload.service_charge)) {
    validationErrors.push({
      field: 'service_charge',
      message: `Service charge must be one of ${validServiceCharge.join(', ')}`,
    });
  }

  return validationErrors;
}

export function validateTwo(payload: TransactionServiceProps) {
  const validationErrors: { field: string; message: string }[] = [];

  const fields = [
    {
      field: 'service_id',
      value: payload.service_id,
      message: 'Service id is required',
      maxLength: 24,
    },
    {
      field: 'price',
      value: payload.price,
      message: 'Price is required',
      maxLength: 10,
    },
    {
      field: 'service_charge',
      value: payload.service_charge,
      message: 'Service charge is required',
      maxLength: 10,
    },
  ];

  fields.forEach(({ field, value, message, maxLength }) => {
    if (value) {
      if (value.length > maxLength) {
        validationErrors.push({
          field,
          message: `${field.replace('_', ' ').charAt(0).toUpperCase() + field.replace('_', ' ').slice(1)} cannot exceed ${maxLength} characters`,
        });
      }
    } else {
      validationErrors.push({ field, message });
    }
  });

  if (!mongoose.Types.ObjectId.isValid(payload.service_id)) {
    validationErrors.push({
      field: 'service_id',
      message: 'Service id must be a 24-character hexadecimal string',
    });
  }

  if (isNaN(parseInt(payload.price, 10))) {
    validationErrors.push({
      field: 'price',
      message: 'Price must be a valid number',
    });
  }

  if (!validServiceCharge.includes(payload.service_charge)) {
    validationErrors.push({
      field: 'service_charge',
      message: `Service charge must be one of ${validServiceCharge.join(', ')}`,
    });
  }

  return validationErrors;
}

export const createOngoingTransaction = async (payload: OngoingTransactionProps) => {
  const validationErrors = validate(payload);
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
  } catch (error) {
    return {
      success: false,
      status: 500,
      errors: [{ field: 'unknown', message: 'An unexpected error occurred' }],
    };
  }
};

export const addTransactionService = async (payload: TransactionServiceProps, id: string) => {
  const validationErrors = validateTwo(payload);
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
