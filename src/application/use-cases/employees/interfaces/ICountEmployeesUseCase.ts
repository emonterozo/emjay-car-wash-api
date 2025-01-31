import { UseCaseResult } from "../../common";

export type EmployeeCountResult = UseCaseResult<{ count: number }>

export interface ICountEmployeesUseCase {
    execute(): Promise<EmployeeCountResult>;
}