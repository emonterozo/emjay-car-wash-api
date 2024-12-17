import { IGetAllCustomersUseCase } from "src/application/use-cases/customers/interfaces/IGetAllCustomers";
import { IGetOneCustomerUseCase } from "src/application/use-cases/customers/interfaces/IGetOneCustomerUseCase";
import { IGetServicesCountUseCase } from "src/application/use-cases/customers/interfaces/IGetServicesCountUseCase";
import { CustomerServCountResponse, ICustomerServicesController } from "src/interfaces/controllers/customers/IGetCustomerServicesController";

export class CustomerServicesController implements ICustomerServicesController {

    constructor(
        private readonly _get_customer_services: IGetServicesCountUseCase,
        private readonly _get_customer: IGetOneCustomerUseCase
    ) { }

    public async handle(id: string): Promise<CustomerServCountResponse> {
        if (typeof id !== 'string' || id.length === 0) return {
            errors: [{ field: 'id', message: 'Invalid ID' }],
            data: { customer_services: null }
        }

        // Validates if customer exists
        const { errors: is_exist_err, result: is_exist_res } = await this._get_customer.execute({ id });
        const  { customer } =  is_exist_res;
        if (!customer) return {
            data: { customer_services: null },
            errors: is_exist_err
        }

        // Get customer services
        const { result, errors } = await this._get_customer_services.execute(id);
        const { customer_services } = result;

        return {
            errors: errors,
            data: {
                customer_services
            }
        }

    }
}