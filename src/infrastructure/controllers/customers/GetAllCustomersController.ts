import { IGetAllCustomerParams, IGetAllCustomersUseCase } from '../../../application/use-cases/customers/interfaces/IGetAllCustomers';
import {
  GetAllCustomersControllerOutput,
  IGetAllCustomersController,
} from '../../../interfaces/controllers/customers/IGetAllCustomersController';

export class GetAllCustomersController implements IGetAllCustomersController {
  constructor(private readonly usecase: IGetAllCustomersUseCase) {}

  public async handle(params?: IGetAllCustomerParams): Promise<GetAllCustomersControllerOutput> {
    const customers = await this.usecase.execute(params);

    return {
      data: {
        customers,
      },
      errors: [],
    };
  }
}
