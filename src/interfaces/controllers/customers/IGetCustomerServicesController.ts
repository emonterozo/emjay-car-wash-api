import { CustomerServicesObject } from "src/application/use-cases/customers/interfaces/common";
import { ControllerResponse } from "../common";

export type CustomerServCountResponse = ControllerResponse<{ customer_services: CustomerServicesObject | null }>;

export interface ICustomerServicesController {
    handle(id: string): Promise<CustomerServCountResponse>
}