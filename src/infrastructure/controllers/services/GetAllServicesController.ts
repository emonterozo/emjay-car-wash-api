import { IGetAllServicesUseCase } from "src/application/use-cases/services/interfaces/IGetAllServicesUseCase";
import { GetAllServicesControllerReponse, IGetAllServicesController, Service } from "src/interfaces/controllers/services/IGetAllServicesController";

export class GetAllServicesController implements IGetAllServicesController {

    constructor(private readonly getAllServicesUseCase: IGetAllServicesUseCase) { }

    public async handle(): Promise<GetAllServicesControllerReponse> {
        const { errors, result: { services } } = await this.getAllServicesUseCase.execute();

        const polished_data = services.map<Service>(({ rating, ...service }) => {
            const overall_reviews = Object.entries(rating)
                .reduce<number>((accum, [rate, rating_count]) => accum += (+rate * rating_count), 0);


            const total_ratings = Object.values(rating)
                .reduce<number>((accum, curr) => accum += curr, 0);

            const computed_ratings = overall_reviews / total_ratings;

            return {
                ...service,
                rating: +computed_ratings.toFixed(1)
            }
        });

        return {
            errors: errors,
            data: {
                services: polished_data
            }
        }

    }
}