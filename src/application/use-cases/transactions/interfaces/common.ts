import { CustomerId } from "../../customers/interfaces/common";
import { Pricing, ServiceId } from "../../services/interfaces/common";

export type AvailedServiceID = string;

export interface AvailedService {
  id: AvailedServiceID;
  service_id: ServiceId;
  deduction: number;
  company_earnings: number;
  employee_share: number;
  assigned_employee_id: string[];
  start_date?: Date;
  end_date?: Date;
  status: string;
  is_free: boolean;
  price: number;
}

export type TransactionStatus = 'PENDING' | 'ONGOING' | 'DONE' | 'CANCELLED'

export interface TransactionDetails {
  customer_id: CustomerId | null;
  vehicle_type: string;
  vehicle_size: string;
  model: string;
  plate_number: string;
  contact_number?: string;
  check_in: Date;
  check_out: Date | null;
  status: TransactionStatus; // TODO: This should be computed depending on the services status
  services: AvailedService[]
}

export interface TransactionObject extends TransactionDetails {
  id: string;
}

export interface AvailedServiceInput {
  id: string;
  is_free: boolean;
  size: Pricing['size']
}

export interface CreateTransactionInput {
  customer_id: CustomerId | null;
  vehicle_type: string;
  vehicle_size: string;
  model: string;
  plate_number: string;
  contact_number?: string;
  services: AvailedServiceInput[];
}