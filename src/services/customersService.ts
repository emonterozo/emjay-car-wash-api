import Customer from '../models/customerModel';
import { PaginationOption } from '../common/types';
import { recentTransactionService } from './shared/recentTransactionService';

export const getAllCustomers = async (option: PaginationOption) => {
  try {
    const { field, direction, limit, offset } = option;
    const query = Customer.find();

    if (limit > 0) query.limit(limit);
    if (offset > 0) query.skip(offset);

    query.sort({ [field]: direction });

    const data = await query;

    const totalCount = await Customer.countDocuments();

    const customers = data.map((item) => ({
      id: item._id.toString(),
      first_name: item.first_name,
      last_name: item.last_name,
      gender: item.gender,
      contact_number: item.contact_number,
      registered_on: item.registered_on,
    }));

    return {
      success: true,
      customers,
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

export const getCustomerById = async (customer_id: string) => {
  try {
    const document = await Customer.findById(customer_id).exec();

    if (document) {
      const { _id, password, ...customer } = document.toObject();

      const res = await recentTransactionService('customer', _id);

      if (res.success) {
        return {
          success: true,
          customer: {
            ...customer,
            id: _id.toString(),
            recent_transactions: res.transactions,
          },
        };
      } else {
        return {
          success: res.status,
          status: res.status,
          error: res.error,
        };
      }
    }

    return {
      success: false,
      status: 404,
      error: {
        field: 'customer_id',
        message: 'Customer does not exist',
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

export const getCustomerWashCountById = async (customer_id: string) => {
  try {
    const document = await Customer.findById(customer_id).exec();

    if (document) {
      const free_wash: {
        size: string;
        count: number;
        vehicle_type: string;
      }[] = [];

      document.car_wash_service_count.forEach((item) => {
        if (item.count >= 10) {
          free_wash.push({
            size: item.size,
            count: item.count,
            vehicle_type: 'car',
          });
        }
      });

      document.moto_wash_service_count.forEach((item) => {
        if (item.count >= 10) {
          free_wash.push({
            size: item.size,
            count: item.count,
            vehicle_type: 'motorcycle',
          });
        }
      });

      return {
        success: true,
        customer: {
          id: document._id.toString(),
          first_name: document.first_name,
          last_name: document.last_name,
          contact_number: document.contact_number,
          points: document.points,
          free_wash,
        },
      };
    }

    return {
      success: false,
      status: 404,
      error: {
        field: 'customer_id',
        message: 'Customer does not exist',
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
