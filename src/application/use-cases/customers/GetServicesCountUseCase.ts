import { ICustomerServicesRepository } from "src/application/ports/repositories/ICustomerServiceRepository";
import { UseCaseResult } from "../common";
import { CustomerId, CustomerServicesObject } from "./interfaces/common";
import { IGetServicesCountUseCase, ServicesUseCaseResponse } from "./interfaces/IGetServicesCountUseCase";

export class GetCustomerServicesUseCase implements IGetServicesCountUseCase {

    constructor(private readonly cs_repository: ICustomerServicesRepository) {}

    public async execute(id: CustomerId): Promise<ServicesUseCaseResponse> {
        const customer_services = await this.cs_repository.getCustomerServicesById(id)  
        
        return {
            errors: [],
            result: {
                customer_services: customer_services
            }
        };
    }
}