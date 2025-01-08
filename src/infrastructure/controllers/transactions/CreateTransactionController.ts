import { ErrorMessage } from "src/application/ports/common";
import { ITokenService } from "src/application/ports/services/ITokenService";
import { CreateTransactionUseCase } from "src/application/use-cases/transactions/CreateTransactionUseCase";
import { ControllerResponse } from "src/interfaces/controllers/common";
import { CreateTransactionControllerInput, ICreateTransactionController } from "src/interfaces/controllers/transactions/ICreateTransactionController";

export class CreateTransactionController implements ICreateTransactionController {

    constructor(
        private readonly _create_transaction_usecase: CreateTransactionUseCase,
        private readonly _token_service: ITokenService
    ) { }

    public async handle(token: string, params: CreateTransactionControllerInput): Promise<ControllerResponse<{ success: boolean; }>> {

        const is_valid_token = await this._token_service.verify(token);

        if (!is_valid_token) return {
            data: { success: false },
            errors: [{ field: 'unknown', message: 'UNAUTHENTICATED_REQUEST' }]
        };

        const errors: ErrorMessage[] = [];

        if (!params.model) {
            errors.push({ field: 'model', message: 'Model is required' });
        }

        if (!params.plate_number) {
            errors.push({ field: 'plate_number', message: 'Plate number is required' });
        }

        if (!params.vehicle_type) {
            errors.push({ field: 'vehicle_type', message: 'Vehicle type is required' });
        }

        if (!params.vehicle_size) {
            errors.push({ field: 'vehicle_size', message: 'Vehicle size is required' });
        }

        if (!params.services) {
            errors.push({ field: 'services', message: 'Services is required' });
        } else {
            if (!Array.isArray(params.services)) {
                errors.push({ field: 'services', message: 'Services input is invalid.' });
            } else {
                for (const service of params.services) {
                    if (typeof service !== 'object' ||
                        !service?.id ||
                        !service?.is_free ||
                        typeof service?.is_free !== 'boolean' ||
                        typeof service?.id !== 'string'
                    ) {
                        errors.push({ field: 'services', message: 'Services input is invalid.' });
                        break;
                    }
                }
            }
        }


        if (errors.length > 0) {
            return {
                data: { success: false },
                errors
            }
        }

        const { errors: usecase_err, result } = await this._create_transaction_usecase.execute({
            model: params.model!,
            plate_number: params.plate_number!,
            services: params.services!,
            vehicle_size: params.vehicle_size!,
            vehicle_type: params.vehicle_type!,
            contact_number: params.contact_number,
            customer_id: params.customer_id,
        });

        return {
            errors: usecase_err,
            data: {
                success: result.success
            }
        }
    }
}