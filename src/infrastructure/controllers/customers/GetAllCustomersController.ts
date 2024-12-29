import { IGetCustomersCountUseCase } from 'src/application/use-cases/customers/interfaces/IGetCustomersCountUseCase';
import { IGetAllCustomerParams, IGetAllCustomersUseCase } from '../../../application/use-cases/customers/interfaces/IGetAllCustomers';
import {
  GetAllCustomersControllerOutput,
  IGetAllCustomersController,
} from '../../../interfaces/controllers/customers/IGetAllCustomersController';

export class GetAllCustomersController implements IGetAllCustomersController {
  constructor(
    private readonly usecase: IGetAllCustomersUseCase,
    private readonly get_customers_total: IGetCustomersCountUseCase
  ) {}

  public async handle(params?: IGetAllCustomerParams): Promise<GetAllCustomersControllerOutput> {
    const customers = await this.usecase.execute(params);
    const count_result = await this.get_customers_total.execute();

    return {
      data: {
        customers,
        total: count_result.result.total
      },
      errors: [],
    };
  }
}
