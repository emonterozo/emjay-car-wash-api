import { ICustomerRepository } from '../../../application/ports/repositories/ICustomerRepository';
import { CustomerFilterInput } from './interfaces/common';
import {
  GetCustomerUseCaseResponse,
  IGetOneCustomerUseCase,
} from './interfaces/IGetOneCustomerUseCase';

export class GetOneCustomerUseCase implements IGetOneCustomerUseCase {
  constructor(
    private readonly _customer_repository: ICustomerRepository
  ) { }

  public async execute(filters: CustomerFilterInput): Promise<GetCustomerUseCaseResponse> {
    const customer = await this._customer_repository.findOneBy(filters);

    if (!customer)
      return {
        errors: [{ field: '', message: 'Cannot find user' }],
        result: {
          customer: null,
        },
      };

    return {
      errors: [],
      result: {
        customer: {
          ...customer
        }
      },
    };
  }
}
