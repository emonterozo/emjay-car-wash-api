import {
  CarServiceCount,
  MotorServiceCount,
} from '../../../application/use-cases/customers/interfaces/common';
import { ControllerResponse } from '../common';

export interface CustomerRecentTransaction {
  id: string;
  // service_id: string;
  service_name: string;
  price: number;
  date: string;
}

export interface CustomerControllerOutput {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  birth_date: string;
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
  customer: CustomerControllerOutput;
} | null>;

export interface ICustomerServicesController {
  handle(token: string, id: string): Promise<CustomerServCountResponse>;
}
