import { UseCaseResult } from "../../common";
import { CreateEmployeeInput, EmployeeId } from "../common";

export type CreateEmployeeUseCaseResult = UseCaseResult<{ employee_id: EmployeeId } | null>

export interface ICreateEmployeeUseCase {
    execute(input: CreateEmployeeInput): Promise<CreateEmployeeUseCaseResult>
}