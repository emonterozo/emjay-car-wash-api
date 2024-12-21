import { UseCaseResult } from "../../common";
import { ServiceObject } from "./common";

export type GetAllServicesResponse = UseCaseResult<{ services: ServiceObject[] }>

export interface IGetAllServicesUseCase {
    execute(): Promise<GetAllServicesResponse>;
}