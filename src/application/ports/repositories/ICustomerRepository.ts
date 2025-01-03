import { IGetAllCustomerParams } from '../../../application/use-cases/customers/interfaces/IGetAllCustomers';
import {
  CustomerFilterInput,
  CustomerObject,
} from '../../../application/use-cases/customers/interfaces/common';

export interface ICustomerRepository {
  retrieveAll(params?: IGetAllCustomerParams): Promise<Omit<CustomerObject, 'recent_transactions'>[]>;
  findOneBy(conditions: CustomerFilterInput): Promise<Omit<CustomerObject, 'recent_transactions'> | null>;
  count(): Promise<number>;
}
