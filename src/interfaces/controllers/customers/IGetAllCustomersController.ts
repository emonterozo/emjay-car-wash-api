import { IGetAllCustomerParams } from "src/application/use-cases/customers/interfaces/IGetAllCustomers";
import { ControllerResponse } from "../common";

export interface Customer {
    id: string;
    first_name: string;
    last_name: string;
    contact_number: string;
}

export type GetAllCustomersControllerOutput = ControllerResponse<{ customers: Customer[], total: number }>;

export interface IGetAllCustomersController {
    handle(params?: IGetAllCustomerParams): Promise<GetAllCustomersControllerOutput>
}