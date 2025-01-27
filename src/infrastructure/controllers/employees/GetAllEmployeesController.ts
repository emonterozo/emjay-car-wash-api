import { ITokenService } from "../../../application/ports/services/ITokenService";
import { ICountEmployeesUseCase } from "../../../application/use-cases/employees/interfaces/ICountEmployeesUseCase";
import { IGetAllEmployeesUseCase } from "../../../application/use-cases/employees/interfaces/IGetAllEmployeesUseCase";
import { EmployeeControllerOutput, IGetAllEmployeesController } from "../../../interfaces/controllers/employees/IGetAllEmployeesController";

export class GetAllEmployeesController implements IGetAllEmployeesController {

    constructor(
        private readonly getEmployeesUseCase: IGetAllEmployeesUseCase,
        private readonly countEmployeesUseCase: ICountEmployeesUseCase,
        private readonly _token_service: ITokenService
    ) { }

    public async handle(token: string): Promise<EmployeeControllerOutput> {

        if (!token) {
            return {
                data: null,
                errors: [{ field: 'Authorization', message: 'Token is missing.' }],
                status: 401,
                success: false
            };
        }

        const is_valid_token = await this._token_service.verify(token);

        if (!is_valid_token)
            return {
                data: null,
                errors: [{ field: 'Authorization', message: 'Invalid or expired token.' }],
                status: 403,
                success: false
            };

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