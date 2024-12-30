import { CarServiceCount, CustomerRecentTransaction, MotorServiceCount } from '../../../application/use-cases/customers/interfaces/common';
import { ControllerResponse } from '../common';

export interface CustomerControllerOutput {
  id: string;
  first_name: string;
  last_name: string;
  contact_number: string;
  province: string;
  city: string;
  barangay: string;
  address: string;
  registered_on: string;
  car_services_count: CarServiceCount[];
  moto_services_count: MotorServiceCount[];
  recent_transactions: CustomerRecentTransaction[];
}

export type CustomerServCountResponse = ControllerResponse<{
  customer_services: CustomerControllerOutput | null;
}>;

export interface ICustomerServicesController {
  handle(token: string, id: string): Promise<CustomerServCountResponse>;
}
