import { MongoCustomerRepository } from '../../../infrastructure/repositories/mongodb/CustomerRepository';
import { GetAllCustomersController } from './GetAllCustomersController';
import { GetAllCustomersUseCase } from '../../../application/use-cases/customers/GetAllCustomersUseCase';
import { CustomerServicesRepository } from '../../../infrastructure/repositories/mongodb/CustomerServicesRepository';
import { GetCustomerServicesUseCase } from '../../../application/use-cases/customers/GetServicesCountUseCase';
import { CustomerServicesController } from './CustomerServicesController';
import { GetOneCustomerUseCase } from '../../../application/use-cases/customers/GetOneCustomerUseCase';
import { GetCustomersCountUseCase } from 'src/application/use-cases/customers/GetCustomersCountUseCase';
import { TokenService } from 'src/infrastructure/services/TokenService';

// Services
const token_service = new TokenService();

// Repositories
const customer_repository = new MongoCustomerRepository();
const customer_services_repository = new CustomerServicesRepository();

// Use Cases
const getOneCustomerUseCase = new GetOneCustomerUseCase(customer_repository);
const getAllCustomersUseCase = new GetAllCustomersUseCase(customer_repository);
const getCustomerServicesUseCase = new GetCustomerServicesUseCase(customer_services_repository);
const getCustomersCountUseCase = new GetCustomersCountUseCase(customer_repository)

// Controllers
export const getAllCustomersController = new GetAllCustomersController(getAllCustomersUseCase, getCustomersCountUseCase, token_service);
export const getCustomerServicesController = new CustomerServicesController(
  // getCustomerServicesUseCase,
  getOneCustomerUseCase,
  token_service
);
