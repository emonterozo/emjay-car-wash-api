import { MongoCustomerRepository } from '../../../infrastructure/repositories/mongodb/CustomerRepository';
import { GetAllCustomersController } from './GetAllCustomersController';
import { GetAllCustomersUseCase } from '../../../application/use-cases/customers/GetAllCustomersUseCase';
import { CustomerServicesController } from './CustomerServicesController';
import { GetOneCustomerUseCase } from '../../../application/use-cases/customers/GetOneCustomerUseCase';
import { GetCustomersCountUseCase } from '../../../application/use-cases/customers/GetCustomersCountUseCase';
import { TokenService } from '../../../infrastructure/services/TokenService';

// Services
const token_service = new TokenService();

// Repositories
const customer_repository = new MongoCustomerRepository();

// Use Cases
const getOneCustomerUseCase = new GetOneCustomerUseCase(customer_repository);
const getAllCustomersUseCase = new GetAllCustomersUseCase(customer_repository);
const getCustomersCountUseCase = new GetCustomersCountUseCase(customer_repository)

// Controllers
export const getAllCustomersController = new GetAllCustomersController(getAllCustomersUseCase, getCustomersCountUseCase, token_service);
export const getCustomerServicesController = new CustomerServicesController(
  getOneCustomerUseCase,
  token_service
);
