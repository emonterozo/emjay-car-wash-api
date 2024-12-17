import { CustomerObject } from "./common";

export interface IGetAllCustomersUseCase {
    execute(): Promise<Omit<CustomerObject, 'password'>[]>;
}