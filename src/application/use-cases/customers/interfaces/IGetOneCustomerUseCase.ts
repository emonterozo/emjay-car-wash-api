import { UseCaseResult } from "../../common";
import { CustomerFilterInput, CustomerId, CustomerObject } from "./common";

export type GetCustomerUseCaseResponse = UseCaseResult<{ customer: CustomerObject | null }>

export interface IGetOneCustomerUseCase {
    execute(filters: CustomerFilterInput): Promise<GetCustomerUseCaseResponse>;
}