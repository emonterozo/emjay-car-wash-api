import { IGetAllCustomerParams } from 'src/application/use-cases/customers/interfaces/IGetAllCustomers';
import {
  CustomerFilterInput,
  CustomerObject,
} from '../../../application/use-cases/customers/interfaces/common';

export interface ICustomerRepository {
  retrieveAll(params?: IGetAllCustomerParams): Promise<CustomerObject[]>;
  findOneBy(conditions: CustomerFilterInput): Promise<CustomerObject | null>;
}
