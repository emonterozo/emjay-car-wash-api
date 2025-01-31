import { ControllerResponse } from "../common"

export interface EmployeeRecentTransaction {
    id: string;
    service_name: string;
    price: number;
    date: string;
}

export interface GetOneEmployeeOutput {
    id: string;
    first_name: string;
    last_name: string;
    gender: string;
    employee_title: string;
    employee_status: string;
    contact_number: string;
    birth_date: string;
    date_started: string;
    recent_transactions: EmployeeRecentTransaction[]
}

export type GetOneEmployeeControllerResponse = ControllerResponse<{ employeee: GetOneEmployeeOutput } | null>

export interface IGetOneEmployeeController {
    handle(token: string, id: string): Promise<GetOneEmployeeControllerResponse>;
}