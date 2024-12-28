import { IServiceRepsository } from '../../../application/ports/repositories/IServiceRepository';
import {
  GetAllServicesResponse,
  GetAllServicesUseCaseInput,
  IGetAllServicesUseCase,
} from './interfaces/IGetAllServicesUseCase';

export class GetAllServicesUseCase implements IGetAllServicesUseCase {
  constructor(private readonly service_repository: IServiceRepsository) {}

  public async execute(input?: GetAllServicesUseCaseInput): Promise<GetAllServicesResponse> {
    const response: GetAllServicesResponse = {
      errors: [],
      result: {
        services: [],
      },
    };

    try {
      const {
        // default '0' (don't limit)
        limit = 0,

        // default 0
        offset = 0,

        // default to order by rating asc
        order_by = { direction: 'asc', field: 'review' },
      } = input ?? {};

      const services = await this.service_repository.findAll({
        limit,
        offset,
        order_by,
      });

      response.result.services = services;
    } catch (error) {
      response.errors.push({ field: 'unknown', message: 'UseCaseError' });
    } finally {
      return response;
    }
  }
}
