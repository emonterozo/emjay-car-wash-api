import { IGetAllTransactionsUseCase } from 'src/application/use-cases/transactions/interfaces/IGetAllTransactionUseCase';
import { ITokenService } from '../../../application/ports/services/ITokenService';
import { IGetOneCustomerUseCase } from '../../../application/use-cases/customers/interfaces/IGetOneCustomerUseCase';
import {
  CustomerServCountResponse,
  ICustomerServicesController,
} from '../../../interfaces/controllers/customers/IGetCustomerServicesController';
import { CustomerRecentTransaction } from 'src/application/use-cases/customers/interfaces/common';
import { IGetOneServiceUseCase } from 'src/application/use-cases/services/interfaces/IGetOneServiceUseCase';

export class CustomerServicesController implements ICustomerServicesController {
  constructor(
    private readonly _get_customer: IGetOneCustomerUseCase,
    private readonly _get_all_transactions: IGetAllTransactionsUseCase,
    private readonly _get_service: IGetOneServiceUseCase,
    private readonly _token_service: ITokenService,
  ) { }

  public async handle(token: string, id: string): Promise<CustomerServCountResponse> {

    if (!token) {
      return {
        data: null,
        errors: [{ field: 'Authorization', message: 'Token is missing.' }],
        status: 401,
        success: false
      };
    }

    const is_valid_token = await this._token_service.verify(token);

    if (!is_valid_token)
      return {
        data: null,
        errors: [{ field: 'Authorization', message: 'Invalid or expired token.' }],
        status: 403,
        success: false
      };

    if (typeof id !== 'string' || id.length === 0)
      return {
        errors: [{ field: 'id', message: 'Invalid ID' }],
        data: null,
        status: 403,
        success: false
      };

    // Validates if customer exists
    const { errors: is_exist_err, result: is_exist_res } = await this._get_customer.execute({ id });

    const { customer } = is_exist_res;

    // If customer not exist return immediately
    if (!customer)
      return {
        data: null,
        success: false,
        status: 404,
        errors: is_exist_err.map(err => ({ field: 'customer_id', message: err.message })),
      };

    // Set range/limit for recent transactions
    const start = new Date(Date.now());
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - 7);
    const end = new Date(Date.now());
    end.setHours(23, 59, 59, 59);

    // Gets recent transactions
    const {
      result: { transactions },
    } = await this._get_all_transactions.execute({
      and_conditions: [
        { field: 'customer_id', value: customer.id },
        { field: 'status', value: 'COMPLETED' }
      ],
      range: {
        field: 'check_out',
        start: start,
        end: end,
      },
      order_by: {
        field: 'check_out',
        direction: 'desc'
      }
    });

    // Initializes recent transactions
    const recent_transactions: CustomerRecentTransaction[] = [];

    for (let transac of transactions) {
      for (let service_entry of transac.services) {
        // Gets service details
        const {
          result: { service },
        } = await this._get_service.execute({ id: service_entry.service_id });

        // Adds entry to recent transactions array
        recent_transactions.push({
          date: transac?.check_out?.toISOString() ?? '',
          id: service_entry.id,
          price: service_entry.price,
          // service_id: service?.id ?? '',
          service_name: service?.title ?? '',
        });
      }
    }

    return {
      data: {
        customer: {
          id: customer.id,
          first_name: customer.first_name,
          last_name: customer.last_name,
          gender: customer.gender,
          birth_date: customer.birth_date,
          contact_number: customer.contact_number,
          address: customer.address,
          barangay: customer.barangay,
          city: customer.city,
          province: customer.province,
          registered_on: customer.registered_on,
          recent_transactions: recent_transactions,
          car_services_count: customer.car_services_count,
          moto_services_count: customer.motor_services_count,
        },
      },
      errors: is_exist_err,
      status: 200,
      success: true
    };
  }
}
