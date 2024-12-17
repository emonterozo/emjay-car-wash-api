import { CustomerFilterInput, CustomerObject } from "src/application/use-cases/customers/interfaces/common";

export interface ICustomerRepository {
    retrieveAll(): Promise<CustomerObject[]>;
    findOneBy(conditions: CustomerFilterInput): Promise<CustomerObject | null>;
}