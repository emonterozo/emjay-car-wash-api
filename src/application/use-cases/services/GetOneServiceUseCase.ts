import { IServiceRepsository } from "src/application/ports/repositories/IServiceRepository";
import { UseCaseResult } from "../common";
import { ServiceFilterInput, ServiceObject } from "./interfaces/common";
import { IGetOneServiceUseCase } from "./interfaces/IGetOneServiceUseCase";

export class GetOneServiceUseCase implements IGetOneServiceUseCase {

    constructor(private _service_repository: IServiceRepsository) { }

    public async execute(params: ServiceFilterInput): Promise<UseCaseResult<{ service: ServiceObject | null; }>> {
        const service = await this._service_repository.findOne(params);

        return { errors: [], result: { service } };
    }
}