import { ControllerResponse } from "../common";

export interface CreateTransactionControllerInput {
    customer_id?: string;
    vehicle_type?: string;
    vehicle_size?: string;
    model?: string;
    plate_number?: string;
    contact_number?: string;
    check_in?: string;
    services?: {
        id: string;
        is_free: boolean;
    }[]
}

export interface ICreateTransactionController {
    handle(params: CreateTransactionControllerInput): Promise<ControllerResponse<{ success: boolean }>>
}