import { TokenService } from 'src/infrastructure/services/TokenService';
import { GetAllServicesUseCase } from '../../../application/use-cases/services/GetAllServicesUseCase';
import { ServiceRepository } from '../../../infrastructure/repositories/mongodb/ServiceRepository';
import { GetAllServicesController } from './GetAllServicesController';

// Services
const token_service = new TokenService();

// Repositories
const service_repository = new ServiceRepository();

// Use Cases
const get_all_services_use_case = new GetAllServicesUseCase(service_repository);

// Controllers
export const get_all_services_controller = new GetAllServicesController(get_all_services_use_case, token_service);
