import { GetAllServicesUseCase } from "src/application/use-cases/services/GetAllServicesUseCase";
import { ServiceRepository } from "src/infrastructure/repositories/mongodb/ServiceRepository";
import { GetAllServicesController } from "./GetAllServicesController";

// Repositories
const service_repository = new ServiceRepository();

// Use Cases
const get_all_services_use_case = new GetAllServicesUseCase(service_repository);

// Controllers
export const get_all_services_controller = new GetAllServicesController(get_all_services_use_case);