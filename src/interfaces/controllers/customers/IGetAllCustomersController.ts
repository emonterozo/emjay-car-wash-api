import { IGetAllCustomerParams } from "src/application/use-cases/customers/interfaces/IGetAllCustomers";
import { ControllerResponse } from "../common";

export interface CustomerOutput {
    id: string;
    first_name: string;
    last_name: string;
    contact_number: string;
    registered_on: string;
}

export type GetAllCustomersControllerOutput = ControllerResponse<{ customers: CustomerOutput[], total: number } | null>;

export interface IGetAllCustomersController {
    handle(token: string, params?: IGetAllCustomerParams): Promise<GetAllCustomersControllerOutput>
}