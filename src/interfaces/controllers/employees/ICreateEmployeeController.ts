import { EmployeeObject } from "src/application/use-cases/employees/common"
import { ControllerResponse } from "../common"
import { GetOneEmployeeOutput } from "./IGetOneEmployeeController";

export type CreateEmployeeControllerResponse = ControllerResponse<{ employee: Omit<GetOneEmployeeOutput, 'recent_transactions'> } | null>

export interface CreateEmployeeControllerInput {
    first_name: string;
    last_name: string;
    gender: "MALE" | "FEMALE";
    employee_title: string;
    employee_status: "ACTIVE" | "TERMINATED";
    contact_number: string;
    birth_date: string;
    date_started: string;
}

export interface ICreateEmployeeController {
    handle(token: string, params: CreateEmployeeControllerInput): Promise<CreateEmployeeControllerResponse>;
}