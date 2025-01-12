import { TransactionObject } from "src/application/use-cases/transactions/interfaces/common";
import { IGetAllTransactionsParams } from "src/application/use-cases/transactions/interfaces/IGetAllTransactionUseCase";
import { InsertedId } from "./common";
import { ServiceId } from "src/application/use-cases/services/interfaces/common";
import { CustomerId } from "src/application/use-cases/customers/interfaces/common";

export interface TransactionServiceInput {
  id: ServiceId;
  is_free: boolean;
  deduction: number;
  company_earnings: number;
  employee_share: number;
  assigned_employee_id: string[];
  start_date?: Date;
  end_date?: Date;
  status: string;
  price: number;
}

export interface ITransactionInput {
  customer_id?: CustomerId;
  vehicle_type: string;
  vehicle_size: string;
  model: string;
  plate_number: string;
  contact_number?: string;
  check_in: Date;
  services: TransactionServiceInput[];
}

export interface ITransactionRepository {
  findAll(params?: IGetAllTransactionsParams): Promise<TransactionObject[]>;
  save(params: ITransactionInput): Promise<InsertedId>;
}