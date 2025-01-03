import { ITokenService } from '../../../application/ports/services/ITokenService';
import { IGetAllCustomersUseCase } from '../../../application/use-cases/customers/interfaces/IGetAllCustomers';
import { IGetOneCustomerUseCase } from '../../../application/use-cases/customers/interfaces/IGetOneCustomerUseCase';
import {
  CustomerServCountResponse,
  ICustomerServicesController,
} from '../../../interfaces/controllers/customers/IGetCustomerServicesController';

export class CustomerServicesController implements ICustomerServicesController {
  constructor(
    // private readonly _get_customer_services: IGetServicesCountUseCase,
    private readonly _get_customer: IGetOneCustomerUseCase,
    private readonly _token_service: ITokenService
  ) { }

  public async handle(token: string, id: string): Promise<CustomerServCountResponse> {

    const is_valid_token = await this._token_service.verify(token);

    if (!is_valid_token) return {
      data: { customer_services: null },
      errors: [{ field: 'unknown', message: 'UNAUTHENTICATED_REQUEST' }]
    };


    if (typeof id !== 'string' || id.length === 0)
      return {
        errors: [{ field: 'id', message: 'Invalid ID' }],
        data: { customer_services: null },
      };

    // Validates if customer exists
    const { errors: is_exist_err, result: is_exist_res } = await this._get_customer.execute({ id });

    const { customer } = is_exist_res;

    // If customer not exist return immediately
    if (!customer) return {
      data: {
        customer_services: null
      },
      errors: is_exist_err,
    };

    return {
      data: {
        customer_services: {
          id: customer.id,
          first_name: customer.first_name,
          last_name: customer.last_name,
          birth_date: customer.birth_date,
          contact_number: customer.contact_number,
          address: customer.address,
          barangay: customer.barangay,
          city: customer.city,
          province: customer.province,
          registered_on: customer.registered_on,
          recent_transactions: customer.recent_transactions,
          car_services_count: customer.car_services_count,
          moto_services_count: customer.motor_services_count
        },
      },
      errors: is_exist_err,
    };
  }
}
