import { ICustomerRepository } from '../../../application/ports/repositories/ICustomerRepository';
import { IGetAllCustomerParams, IGetAllCustomersUseCase } from './interfaces/IGetAllCustomers';
import { CustomerObject } from './interfaces/common';

export class GetAllCustomersUseCase implements IGetAllCustomersUseCase {
  constructor(private readonly customer_repository: ICustomerRepository) {}

  async execute(params?: IGetAllCustomerParams): Promise<Omit<CustomerObject, 'password'>[]> {
    const customers = await this.customer_repository.retrieveAll({
      limit: params?.limit ?? 0,
      offset: params?.offset ?? 0,
      order_by: params?.order_by ?? { field: 'first_name', direction: 'asc' }
    });

    return customers.map(({ password: ommited_pass, ...customer }) => ({
      ...customer,
    }));
  }
}
