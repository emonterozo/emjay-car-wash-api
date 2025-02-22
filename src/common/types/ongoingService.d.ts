export interface TransactionServiceProps {
  service_id: string;
  price: string;
  service_charge: string;
}

export interface OngoingTransactionProps extends TransactionServiceProps {
  customer_id?: string;
  vehicle_type: string;
  vehicle_size: string;
  model: string;
  plate_number: string;
  contact_number?: string;
}

export interface UpdateTransactionServiceProps {
  deduction: string;
  discount: string;
  assigned_employee?: string[];
  status: string;
  is_free: boolean;
  is_paid: boolean;
}

export interface UpdateTransactionStatusProps {
  status: string;
}
