import { Limit, Offset, OrderBy } from "src/application/ports/repositories/common";
import { UseCaseResult } from "../../common";
import { ServiceObject } from "./common";

export type GetAllServicesResponse = UseCaseResult<{ services: ServiceObject[] }>

export interface GetAllServicesUseCaseInput {
    offset: Offset;
    order_by: OrderBy<keyof ServiceObject>;
    limit: Limit;
}

export interface IGetAllServicesUseCase {
    execute(input?: GetAllServicesUseCaseInput): Promise<GetAllServicesResponse>;
}