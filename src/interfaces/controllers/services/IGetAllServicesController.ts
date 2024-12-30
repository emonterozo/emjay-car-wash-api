import { GetAllServicesUseCaseInput } from '../../../application/use-cases/services/interfaces/IGetAllServicesUseCase';
import { ControllerResponse } from '../common';

export interface Service {
  id: string;
  image: string;
  title: string;
  description: string;
  review: number;
  reviews_count: number;
  type: string;
  price_list: Array<{
    size: string;
    price: number;
  }>;
}

export type GetAllServicesControllerReponse = ControllerResponse<{ services: Service[] } | null>;

export interface IGetAllServicesController {
  handle(token: string, input?: GetAllServicesUseCaseInput): Promise<GetAllServicesControllerReponse>;
}
