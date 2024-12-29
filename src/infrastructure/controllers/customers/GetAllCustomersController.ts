import { IGetCustomersCountUseCase } from 'src/application/use-cases/customers/interfaces/IGetCustomersCountUseCase';
import { IGetAllCustomerParams, IGetAllCustomersUseCase } from '../../../application/use-cases/customers/interfaces/IGetAllCustomers';
import {
  CustomerOutput,
  GetAllCustomersControllerOutput,
  IGetAllCustomersController,
} from '../../../interfaces/controllers/customers/IGetAllCustomersController';

export class GetAllCustomersController implements IGetAllCustomersController {
  constructor(
    private readonly usecase: IGetAllCustomersUseCase,
    private readonly get_customers_total: IGetCustomersCountUseCase
  ) { }

  public async handle(params?: IGetAllCustomerParams): Promise<GetAllCustomersControllerOutput> {
    const customers_raw = await this.usecase.execute(params);
    const count_result = await this.get_customers_total.execute();

    const customers = customers_raw.map<CustomerOutput>(customer => ({
      id: customer.id,
      contact_number: customer.contact_number,
      first_name: customer.first_name,
      last_name: customer.last_name,
      registered_on: customer.registered_on
    }))

    return {
      data: {
        customers,
        total: count_result.result.total
      },
      errors: [],
    };
  }
}
