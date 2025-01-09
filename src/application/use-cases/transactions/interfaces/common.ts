import { CustomerId } from "../../customers/interfaces/common";
import { ServiceId } from "../../services/interfaces/common";

interface TransactionService {
  id: ServiceId;
  deduction: number;
  company_earnings: number;
  employee_share: number;
  assigned_employee_id: string[];
  start_date?: Date;
  end_date?: Date;
  status: string;
  is_free: boolean;
}

export interface TransactionDetails {
  customer_id?: string;
  vehicle_type: string;
  vehicle_size: string;
  model: string;
  plate_number: string;
  contact_number?: string;
  check_in: Date;
  // status: string; // TODO: This should be computed depending on the services status
  services: TransactionService[]
}

export interface TransactionObject extends TransactionDetails {
  id: string;
}

export interface CreateTransactionInput {
  customer_id?: CustomerId;
  vehicle_type: string;
  vehicle_size: string;
  model: string;
  plate_number: string;
  contact_number?: string;
  services: {
    id: ServiceId;
    is_free: boolean;
  }[];
}