import { ICreateEmployeeUseCase } from "src/application/use-cases/employees/interfaces/ICreateEmployeeUseCase";
import { IGetOneEmployeeUseCase } from "src/application/use-cases/employees/interfaces/IGetOneEmployeeUseCase";
import { CreateEmployeeControllerInput, CreateEmployeeControllerResponse, ICreateEmployeeController } from "src/interfaces/controllers/employees/ICreateEmployeeController";

export class CreateEmployeeController implements ICreateEmployeeController {

    constructor(
        private readonly createEmployeeUseCase: ICreateEmployeeUseCase,
        private readonly getEmployeeUseCase: IGetOneEmployeeUseCase
    ) { }

    public async handle(token: string, params: CreateEmployeeControllerInput): Promise<CreateEmployeeControllerResponse> {

        const { errors, result } = await this.createEmployeeUseCase.execute(params);

        if (!result) return {
            data: null,
            errors: errors,
            status: 400,
            success: false
        }

        const { errors: retrieve_errors, result: retrieve_employee } = await this.getEmployeeUseCase.execute({ id: result.employee_id });

        if (!retrieve_employee) return {
            data: null,
            errors: retrieve_errors,
            status: 400,
            success: false
        }

        return {
            data: {
                employee: {
                    id: retrieve_employee.employee.id,
                    birth_date: retrieve_employee.employee.birth_date.toISOString(),
                    contact_number: retrieve_employee.employee.contact_number,
                    date_started: retrieve_employee.employee.date_started.toISOString(),
                    employee_status: retrieve_employee.employee.employee_status,
                    employee_title: retrieve_employee.employee.employee_title,
                    first_name: retrieve_employee.employee.first_name,
                    gender: retrieve_employee.employee.gender,
                    last_name: retrieve_employee.employee.last_name
                }
            },
            errors: retrieve_errors,
            status: retrieve_errors.length === 0 ? 201 : 400,
            success: retrieve_errors.length === 0
        }
    }
}