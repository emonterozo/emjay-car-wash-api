// Services


import { CreateTransactionUseCase } from "../../../application/use-cases/transactions/CreateTransactionUseCase";
import { GetAllTransactionsUseCase } from "../../../application/use-cases/transactions/GetAllTransactionsUseCase";
import { TransactionRepository } from "../../../infrastructure/repositories/mongodb/TransactionRepository";
import { GetAllTransactionsController } from "./GetAllTransactionsController";
import { CreateTransactionController } from "./CreateTransactionController";
import { TokenService } from "../../../infrastructure/services/TokenService";
import { ServiceRepository } from "../../../infrastructure/repositories/mongodb/ServiceRepository";

// Services
const token_service = new TokenService();

// Repository
const transaction_repository = new TransactionRepository();
const service_repository = new ServiceRepository()

// Use Cases
const getAllTransactions = new GetAllTransactionsUseCase(transaction_repository);
const createTranasction = new CreateTransactionUseCase(transaction_repository, service_repository);

// Controllers
export const getAllTransactionsController = new GetAllTransactionsController(getAllTransactions, token_service);
export const createTransactionController = new CreateTransactionController(createTranasction, token_service);