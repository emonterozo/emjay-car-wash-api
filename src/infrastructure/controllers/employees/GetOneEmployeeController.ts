import { ITokenService } from "src/application/ports/services/ITokenService";
import { IGetOneEmployeeUseCase } from "src/application/use-cases/employees/interfaces/IGetOneEmployeeUseCase";
import { IGetOneServiceUseCase } from "src/application/use-cases/services/interfaces/IGetOneServiceUseCase";
import { IGetAllTransactionsUseCase } from "src/application/use-cases/transactions/interfaces/IGetAllTransactionUseCase";
import { EmployeeRecentTransaction, GetOneEmployeeControllerResponse, IGetOneEmployeeController } from "src/interfaces/controllers/employees/IGetOneEmployeeController";

export class GetOneEmployeeController implements IGetOneEmployeeController {

    constructor(
        private readonly getOneEmployeeUseCase: IGetOneEmployeeUseCase,
        private readonly getTransactionsUseCase: IGetAllTransactionsUseCase,
        private readonly getServiceUseCase: IGetOneServiceUseCase,
        private readonly _token_service: ITokenService,
    ) { }

    public async handle(token: string, id: string): Promise<GetOneEmployeeControllerResponse> {

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

        if (typeof id !== 'string' || id.length === 0)
            return {
                errors: [{ field: 'id', message: 'Invalid ID' }],
                data: null,
                status: 403,
                success: false
            };

        const { errors, result } = await this.getOneEmployeeUseCase.execute({ id });

        // If customer not exist return immediately
        if (!result)
            return {
                data: null,
                success: false,
                status: 404,
                errors: errors,
            };

        // Gets recent transactions
        const {
            result: { transactions },
        } = await this.getTransactionsUseCase.execute({
            and_conditions: [
                { field: 'status', value: 'COMPLETED' }
            ],
            order_by: {
                field: 'check_out',
                direction: 'desc'
            }
        });

        // Initializes recent transactions
        const recent_transactions: EmployeeRecentTransaction[] = [];

        for (let transac of transactions) {
            for (let service_entry of transac.services) {
                // Gets service details
                const {
                    result: { service },
                } = await this.getServiceUseCase.execute({ id: service_entry.service_id });

                // Adds entry to recent transactions array
                recent_transactions.push({
                    date: transac?.check_out?.toISOString() ?? '',
                    id: service_entry.id,
                    price: service_entry.price,
                    // service_id: service?.id ?? '',
                    service_name: service?.title ?? '',
                });
            }
        }

        return {
            data: {
                employeee: {
                    id: result.employee.id,
                    birth_date: result.employee.birth_date.toString(),
                    contact_number: result.employee.contact_number,
                    date_started: result.employee.date_started.toString(),
                    employee_status: result.employee.employee_status,
                    employee_title: result.employee.employee_title,
                    first_name: result.employee.first_name,
                    gender: result.employee.gender,
                    last_name: result.employee.last_name,
                    recent_transactions
                }
            },
            errors: errors,
            status: 200,
            success: true
        }
    }
}