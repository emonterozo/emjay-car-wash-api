import { IGetAllCustomersUseCase } from "src/application/use-cases/customers/interfaces/IGetAllCustomers";
import { IGetServicesCountUseCase } from "src/application/use-cases/customers/interfaces/IGetServicesCountUseCase";
import { CustomerServCountResponse, ICustomerServicesController } from "src/interfaces/controllers/customers/IGetCustomerServicesController";

export class CustomerServicesController implements ICustomerServicesController {

    constructor(
        private readonly _get_customer_services: IGetServicesCountUseCase
    ) { }

    public async handle(id: string): Promise<CustomerServCountResponse> {
        if (typeof id !== 'string' || id.length === 0) return {
            errors: [{ field: 'id', message: 'Invalid ID' }],
            data: { customer_services: null }
        }


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