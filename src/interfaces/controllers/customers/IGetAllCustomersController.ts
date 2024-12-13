import { ControllerResponse } from "../common";

export interface Customer {
    id: string;
    first_name: string;
    last_name: string;
    contact_number: string;
}

export type GetAllCustomersControllerOutput = ControllerResponse<{ customers: Customer[] }>;

export interface IGetAllCustomersController {
    handle(): Promise<GetAllCustomersControllerOutput>
}