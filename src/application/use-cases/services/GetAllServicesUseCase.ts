import { IServiceRepsository } from "src/application/ports/repositories/IServiceRepository";
import { GetAllServicesResponse, IGetAllServicesUseCase } from "./interfaces/IGetAllServicesUseCase";


export class GetAllServicesUseCase implements IGetAllServicesUseCase {

    constructor(private readonly service_repository: IServiceRepsository) { }

    public async execute(): Promise<GetAllServicesResponse> {
        const response: GetAllServicesResponse = {
            errors: [],
            result: {
                services: []
            }
        }

        try {
            const services = await this.service_repository.findAll();
            response.result.services = services;
        } catch (error) {
            response.errors.push({ field: 'unknown', message: 'UseCaseError' })
        } finally {
            return response;
        }
    }
}