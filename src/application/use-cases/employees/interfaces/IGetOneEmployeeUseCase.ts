import { UseCaseResult } from "../../common"
import { EmployeeFilterInput, EmployeeObject } from "../common"

export type GetOneEmployeeUseCaseResult = UseCaseResult<{ employee: EmployeeObject } | null>

export interface IGetOneEmployeeUseCase {
    execute(filters?: EmployeeFilterInput): Promise<GetOneEmployeeUseCaseResult>;
}