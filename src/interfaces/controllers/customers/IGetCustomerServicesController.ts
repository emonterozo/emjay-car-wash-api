import { CustomerServicesObject } from '../../../application/use-cases/customers/interfaces/common';
import { ControllerResponse } from '../common';

export type CustomerServCountResponse = ControllerResponse<{
  customer_services: CustomerServicesObject | null;
}>;

export interface ICustomerServicesController {
  handle(token: string, id: string): Promise<CustomerServCountResponse>;
}
