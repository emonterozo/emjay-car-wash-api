import { CustomerId, CustomerServicesObject } from "src/application/use-cases/customers/interfaces/common";

export interface ICustomerServicesRepository {
    getCustomerServicesById(id: CustomerId): Promise<CustomerServicesObject | null>;
}