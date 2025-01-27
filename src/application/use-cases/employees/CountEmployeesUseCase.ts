import { IEmployeeRepository } from "../../../application/ports/repositories/IEmployeeRepository";
import { EmployeeCountResult, ICountEmployeesUseCase } from "./interfaces/ICountEmployeesUseCase";

export class CountEmployeesUseCase implements ICountEmployeesUseCase {

    constructor(private readonly employee_repository: IEmployeeRepository) { }

    public async execute(): Promise<EmployeeCountResult> {
        const count = await this.employee_repository.count();

        return { errors: [], result: { count } };
    }
}