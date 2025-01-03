// Services


import { GetAllTransactionsUseCase } from "../../../application/use-cases/transactions/GetAllTransactionsUseCase";
import { TransactionRepository } from "../../../infrastructure/repositories/mongodb/TransactionRepository";
import { GetAllTransactionsController } from "./GetAllTransactionsController";

// Repository
const transaction_repository = new TransactionRepository();

// Use Cases
const getAllTransactions = new GetAllTransactionsUseCase(transaction_repository);

// Controllers
export const getAllTransactionsController = new GetAllTransactionsController(getAllTransactions);