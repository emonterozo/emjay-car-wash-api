import { ServiceObject } from "src/application/use-cases/services/interfaces/common";

export interface IServiceRepsository {
    findAll(): Promise<ServiceObject[]>;
}