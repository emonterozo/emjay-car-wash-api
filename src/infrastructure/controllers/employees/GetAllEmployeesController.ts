import { IGetAllEmployeesUseCase } from "src/application/use-cases/employees/interfaces/IGetAllEmployeesUseCase";
import { ControllerResponse } from "src/interfaces/controllers/common";
import { EmployeeControllerOutput, EmployeeOutput, IGetAllEmployeesController } from "src/interfaces/controllers/employees/IGetAllEmployeesController";

export class GetAllEmployeesController implements IGetAllEmployeesController {

    constructor(private readonly getEmployeesUseCase: IGetAllEmployeesUseCase) { }

    public async handle(token: string): Promise<EmployeeControllerOutput> {
        const { errors, result } = await this.getEmployeesUseCase.execute();

        const no_errors = errors.length === 0;

        return {
            data: {
                employees: result.employees,
                totalCount: 0
            },
            errors: errors,
            status: no_errors ? 200 : 500,
            success: no_errors
        }
    }
}