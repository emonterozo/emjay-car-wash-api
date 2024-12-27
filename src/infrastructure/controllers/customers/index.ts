import { MongoCustomerRepository } from '../../../infrastructure/repositories/mongodb/CustomerRepository';
import { GetAllCustomersController } from './GetAllCustomersController';
import { GetAllCustomersUseCase } from '../../../application/use-cases/customers/GetAllCustomersUseCase';
import { CustomerServicesRepository } from '../../../infrastructure/repositories/mongodb/CustomerServicesRepository';
import { GetCustomerServicesUseCase } from '../../../application/use-cases/customers/GetServicesCountUseCase';
import { CustomerServicesController } from './CustomerServicesController';
import { GetOneCustomerUseCase } from '../../../application/use-cases/customers/GetOneCustomerUseCase';

// Repositories
const customer_repository = new MongoCustomerRepository();
const customer_services_repository = new CustomerServicesRepository();

// Use Cases
const getOneCustomerUseCase = new GetOneCustomerUseCase(customer_repository);
const getAllCustomersUseCase = new GetAllCustomersUseCase(customer_repository);
const getCustomerServicesUseCase = new GetCustomerServicesUseCase(customer_services_repository);

// Controllers
export const getAllCustomersController = new GetAllCustomersController(getAllCustomersUseCase);
export const getCustomerServicesController = new CustomerServicesController(
  getCustomerServicesUseCase,
  getOneCustomerUseCase,
);
