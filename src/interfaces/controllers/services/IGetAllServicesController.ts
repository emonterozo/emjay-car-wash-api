import { ControllerResponse } from "../common";

export interface Service {
    id: string;
    title: string;
    description: string;
    type: string;
    rating: number;
    price_list: Array<{
        category: string;
        price: number;
    }>;
}

export type GetAllServicesControllerReponse = ControllerResponse<{ services: Service[] }>

export interface IGetAllServicesController {
    handle(): Promise<GetAllServicesControllerReponse>;
}