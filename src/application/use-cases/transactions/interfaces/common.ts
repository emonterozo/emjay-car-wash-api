export interface TransactionDetails {
  vehicle_type: string;
  vehicle_size: string;
  model: string;
  price: number;
  deduction: number;
  company_earnings: number;
  employee_share: number;
  check_ing: string;
  completed_on: string;
  is_free: boolean;
  claimed_by: string;
  service_id: string;
  customer_id: string;
  assigned_employee_id: string[];
}

export interface TransactionObject extends TransactionDetails {
  id: string;
}