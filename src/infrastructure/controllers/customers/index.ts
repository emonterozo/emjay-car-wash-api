import { MongoCustomerRepository } from "src/infrastructure/repositories/mongodb/CustomerRepository";
import { GetAllCustomersController } from "./GetAllCustomersController";
import { GetAllCustomersUseCase } from "src/application/use-cases/customers/GetAllCustomersUseCase";

// Repositories
const customer_repository = new MongoCustomerRepository();

// Use Cases
const getAllCustomersUseCase = new GetAllCustomersUseCase(customer_repository);

// Controllers
export const getAllCustomersController = new GetAllCustomersController(getAllCustomersUseCase)