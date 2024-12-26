import { ControllerResponse } from "../common";

export interface Service {
    id: string;
    image: string;
    title: string;
    description: string;
    ratings: number;
    type: string;
    price_list: Array<{
        size: string;
        price: number;
    }>;
}

export type GetAllServicesControllerReponse = ControllerResponse<{ services: Service[] }>

export interface IGetAllServicesController {
    handle(): Promise<GetAllServicesControllerReponse>;
}