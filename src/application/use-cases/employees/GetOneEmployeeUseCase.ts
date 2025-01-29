import { IEmployeeRepository } from "src/application/ports/repositories/IEmployeeRepository";
import { EmployeeFilterInput } from "./common";
import { GetOneEmployeeUseCaseResult, IGetOneEmployeeUseCase } from "./interfaces/IGetOneEmployeeUseCase";

export class GetOneEmployeeUseCase implements IGetOneEmployeeUseCase {

    constructor(private readonly employee_repository: IEmployeeRepository) { }

    public async execute(filters?: EmployeeFilterInput): Promise<GetOneEmployeeUseCaseResult> {
        const employee = await this.employee_repository.findOne(filters);

        if (!employee) return {
            errors: [{ field: '', message: 'Employee does not exist' }],
            result: null
        }

        return {
            errors: [],
            result: { employee }
        }
    }
}