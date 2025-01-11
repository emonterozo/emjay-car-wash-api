import { MongoCustomerRepository } from '../../../infrastructure/repositories/mongodb/CustomerRepository';
import { GetAllCustomersController } from './GetAllCustomersController';
import { GetAllCustomersUseCase } from '../../../application/use-cases/customers/GetAllCustomersUseCase';
import { CustomerServicesController } from './CustomerServicesController';
import { GetOneCustomerUseCase } from '../../../application/use-cases/customers/GetOneCustomerUseCase';
import { GetCustomersCountUseCase } from '../../../application/use-cases/customers/GetCustomersCountUseCase';
import { TokenService } from '../../../infrastructure/services/TokenService';
import { TransactionRepository } from '../../../infrastructure/repositories/mongodb/TransactionRepository';
import { ServiceRepository } from '../../../infrastructure/repositories/mongodb/ServiceRepository';
import { GetOneServiceUseCase } from '../../..//application/use-cases/services/GetOneServiceUseCase';
import { GetAllTransactionsUseCase } from '../../../application/use-cases/transactions/GetAllTransactionsUseCase';

// Services
const token_service = new TokenService();

// Repositories
const customer_repository = new MongoCustomerRepository();
const transaction_repository = new TransactionRepository();
const service_repository = new ServiceRepository();

// Use Cases
const getOneCustomerUseCase = new GetOneCustomerUseCase(customer_repository);
const getAllCustomersUseCase = new GetAllCustomersUseCase(customer_repository);
const getCustomersCountUseCase = new GetCustomersCountUseCase(customer_repository);
const getServiceUseCase = new GetOneServiceUseCase(service_repository);
const getAllTransactionsUseCase = new GetAllTransactionsUseCase(transaction_repository);

// Controllers
export const getAllCustomersController = new GetAllCustomersController(getAllCustomersUseCase, getCustomersCountUseCase, token_service);
export const getCustomerServicesController = new CustomerServicesController(
  getOneCustomerUseCase,
  getAllTransactionsUseCase,
  getServiceUseCase,
  token_service
);
