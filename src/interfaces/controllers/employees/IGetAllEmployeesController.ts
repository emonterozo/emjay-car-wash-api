import { ControllerResponse } from "../common";

export interface EmployeeOutput {
    totalCount: number;
    employees: Array<{
        first_name: string;
        last_name: string;
        gender: string;
        employee_title: string;
        employee_status: string;
    }>;
}

export type EmployeeControllerOutput = ControllerResponse<EmployeeOutput | null>

export interface IGetAllEmployeesController {
    handle(token: string): Promise<EmployeeControllerOutput>
}