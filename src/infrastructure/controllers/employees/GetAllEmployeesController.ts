import { ICountEmployeesUseCase } from "src/application/use-cases/employees/interfaces/ICountEmployeesUseCase";
import { IGetAllEmployeesUseCase } from "src/application/use-cases/employees/interfaces/IGetAllEmployeesUseCase";
import { ControllerResponse } from "src/interfaces/controllers/common";
import { EmployeeControllerOutput, EmployeeOutput, IGetAllEmployeesController } from "src/interfaces/controllers/employees/IGetAllEmployeesController";

export class GetAllEmployeesController implements IGetAllEmployeesController {

    constructor(
        private readonly getEmployeesUseCase: IGetAllEmployeesUseCase,
        private readonly countEmployeesUseCase: ICountEmployeesUseCase,
    ) { }

    public async handle(token: string): Promise<EmployeeControllerOutput> {
        const { errors, result } = await this.getEmployeesUseCase.execute();
        const { errors: count_errors, result: count_result } = await this.countEmployeesUseCase.execute();

        const no_errors = [...errors, ...count_errors].length === 0;

        return {
            data: {
                employees: result.employees,
                totalCount: count_result.count
            },
            errors: errors,
            status: no_errors ? 200 : 500,
            success: no_errors
        }
    }
}