import { UseCaseResult } from "../../common";
import { ServiceFilterInput, ServiceObject } from "./common";

export interface IGetOneServiceUseCase {
    execute(params: ServiceFilterInput): Promise<UseCaseResult<{ service: ServiceObject | null }>>;
}