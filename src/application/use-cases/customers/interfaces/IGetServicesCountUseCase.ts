import { UseCaseResult } from "../../common";
import { CustomerId, CustomerServicesObject } from "./common";

export type ServicesUseCaseResponse = UseCaseResult<{ customer_services: CustomerServicesObject | null }>

export interface IGetServicesCountUseCase {
    execute(id: CustomerId): Promise<ServicesUseCaseResponse>
}