import { ICustomerRepository } from '../../../application/ports/repositories/ICustomerRepository';
import { IGetAllCustomersUseCase } from './interfaces/IGetAllCustomers';
import { CustomerObject } from './interfaces/common';
import { custom } from 'joi';

export class GetAllCustomersUseCase implements IGetAllCustomersUseCase {
  constructor(private readonly customer_repository: ICustomerRepository) {}

  async execute(): Promise<Omit<CustomerObject, 'password'>[]> {
    const customers = await this.customer_repository.retrieveAll();

    return customers.map(({ password: ommited_pass, ...customer }) => ({
      ...customer,
    }));
  }
}
