import { ITransactionRepository, TransactionServiceInput } from "src/application/ports/repositories/ITransactionRepository";
import { UseCaseResult } from "../common";
import { CreateTransactionInput } from "./interfaces/common";
import { ICreateTransactionUseCase } from "./interfaces/ICreateTransactionUseCase";
import { TransactionEntity } from "../../..//domain/entities/TransactionEntity";
import { ErrorMessage } from "../../../application/ports/common";
import { IServiceRepsository } from "src/application/ports/repositories/IServiceRepository";

export class CreateTransactionUseCase implements ICreateTransactionUseCase {
    constructor(
        private readonly _transaction_repository: ITransactionRepository,
        private readonly _service_repository: IServiceRepsository
    ) { }

    public async execute(input: CreateTransactionInput): Promise<UseCaseResult<{ success: boolean; }>> {
        const new_transaction = TransactionEntity.create({
            customer_id: input.customer_id,
            vehicle_type: input.vehicle_type,
            vehicle_size: input.vehicle_size,
            model: input.model,
            plate_number: input.plate_number,
            services: input.services
        });

        // Initial errors messages
        const errors: ErrorMessage[] = [];

        // Validates customer id
        const customer_err_msg = new_transaction.validateCustomerId();
        customer_err_msg && errors.push({ field: 'customer_id', message: customer_err_msg })
        
        // Validates model
        const model_err_msg = new_transaction.validateModel();
        model_err_msg && errors.push({ field: 'model', message: model_err_msg })

        // Validates plate number
        const plate_err_msg = new_transaction.validatePlateNumber();
        model_err_msg && errors.push({ field: 'plate_number', message: plate_err_msg });

        // Validates vehicle type
        const vehicle_type_err_msg = new_transaction.validateVehicleType();
        vehicle_type_err_msg && errors.push({ field: 'vehicle_type', message: vehicle_type_err_msg });

        // Validates vehicle size
        const vehicle_size_err_msg = new_transaction.validationVehicleSize();
        vehicle_size_err_msg && errors.push({ field: 'vehicle_size', message: vehicle_size_err_msg });

        // Validates services
        const services_err_msg = new_transaction.validateServices();
        services_err_msg && errors.push({ field: 'services', message: services_err_msg });

        if (errors.length) return { errors, result: { success: false } };

        try {
            const services = new_transaction
                .getServicesId()

            const included_services: TransactionServiceInput[] = []

            for (const serv of services) {
                const service = await this._service_repository.findOne({ id: serv.id });
                if (service) {
                    included_services.push({
                        id: service.id,
                        is_free: serv.is_free,
                        deduction: 0,
                        company_earnings: 0,
                        employee_share: 0,
                        assigned_employee_id: [],
                        start_date: undefined,
                        end_date: undefined,
                        status: 'PENDING',
                        price: service.price_list.find(price => price.size === serv.size)?.price ?? 0
                    });
                }
            }

            const inserted_id = await this._transaction_repository.save({
                customer_id: new_transaction.getCustomerId(),
                vehicle_type: new_transaction.getVehicleType(),
                vehicle_size: new_transaction.getVehicleSize(),
                model: new_transaction.getModel(),
                plate_number: new_transaction.getPlateNumber(),
                contact_number: input.contact_number, // validate this
                check_in: new Date(),
                check_out: null,
                services: included_services
            });

            return {
                errors: [],
                result: { success: true }
            }
        } catch (error) {
            console.log(error)
            return {
                errors: [{ message: 'Some went wrong adding.', field: 'unknown' }],
                result: { success: false }
            }
        }
    }
}