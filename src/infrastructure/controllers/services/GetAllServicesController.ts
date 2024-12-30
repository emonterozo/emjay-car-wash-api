import { ITokenService } from '../../../application/ports/services/ITokenService';
import {
  GetAllServicesUseCaseInput,
  IGetAllServicesUseCase,
} from '../../../application/use-cases/services/interfaces/IGetAllServicesUseCase';
import {
  GetAllServicesControllerReponse,
  IGetAllServicesController,
  Service,
} from '../../../interfaces/controllers/services/IGetAllServicesController';

export class GetAllServicesController implements IGetAllServicesController {
  constructor(
    private readonly getAllServicesUseCase: IGetAllServicesUseCase,
    private readonly _token_service: ITokenService
  ) {}

  public async handle(
    token: string,
    input?: GetAllServicesUseCaseInput,
  ): Promise<GetAllServicesControllerReponse> {

    const is_valid_token = await this._token_service.verify(token);

    if (!is_valid_token) return {
      data: null,
      errors: [{ field: 'unknown', message: 'UNAUTHENTICATED_REQUEST' }]
    };


    const {
      errors,
      result: { services },
    } = await this.getAllServicesUseCase.execute(input);

    const polished_data = services.map<Service>((service) => {
      // const overall_reviews = Object.entries(rating).reduce<number>(
      //   (accum, [rate, rating_count]) => (accum += +rate * rating_count),
      //   0,
      // );

      // const total_ratings = Object.values(rating).reduce<number>(
      //   (accum, curr) => (accum += curr),
      //   0,
      // );

      // const computed_ratings = overall_reviews / total_ratings;

      return {
        id: service.id,
        description: service.description,
        price_list: service.price_list,
        title: service.title,
        type: service.type,
        image: service.image_url,
        review: service.review,
        reviews_count: service.reviews_count
      };
    });

    return {
      errors: errors,
      data: {
        services: polished_data,
      },
    };
  }
}
