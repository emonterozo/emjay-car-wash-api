import { Limit, Offset, OrderBy } from "src/application/ports/repositories/common";
import { EmployeeObject } from "../common";
import { UseCaseResult } from "../../common";

export interface GetAllEmployeesParams {
    order_by?: OrderBy<keyof EmployeeObject>;
    limit?: Limit;
    offset?: Offset;
}

export type GetAllEmployeesResult = UseCaseResult<{ employees: EmployeeObject[] }>

export interface IGetAllEmployeesUseCase {
    execute(options?: GetAllEmployeesParams): Promise<GetAllEmployeesResult>;
}