import { Limit, Offset, OrderBy } from "../../../../application/ports/repositories/common";
import { CustomerDetails, CustomerObject } from "./common";

export interface IGetAllCustomerParams {
    order_by?: OrderBy<keyof Omit<CustomerDetails, 'password'>>;
    limit?: Limit;
    offset?: Offset;
}

export interface IGetAllCustomersUseCase {
    execute(params?: IGetAllCustomerParams): Promise<Omit<CustomerObject, 'password' | 'recent_transactions'>[]>;
}