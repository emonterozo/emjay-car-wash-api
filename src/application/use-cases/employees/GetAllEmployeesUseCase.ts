import { IEmployeeRepository } from "src/application/ports/repositories/IEmployeeRepository";
import { GetAllEmployeesParams, GetAllEmployeesResult, IGetAllEmployeesUseCase } from "./interfaces/IGetAllEmployeesUseCase";

export class GetAllEmployeeesUseCase implements IGetAllEmployeesUseCase {

    constructor(private readonly employee_repository: IEmployeeRepository) { }

    public async execute(options?: GetAllEmployeesParams): Promise<GetAllEmployeesResult> {
        const employees = await this.employee_repository.findAll();

        return {
            errors: [],
            result: { employees }
        }
    }
}