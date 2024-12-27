import {
  CustomerId,
  CustomerServicesObject,
} from '../../../application/use-cases/customers/interfaces/common';

export interface ICustomerServicesRepository {
  getCustomerServicesById(id: CustomerId): Promise<CustomerServicesObject | null>;
}
