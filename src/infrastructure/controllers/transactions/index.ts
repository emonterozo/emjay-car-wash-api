// Services


import { CreateTransactionUseCase } from "../../../application/use-cases/transactions/CreateTransactionUseCase";
import { GetAllTransactionsUseCase } from "../../../application/use-cases/transactions/GetAllTransactionsUseCase";
import { TransactionRepository } from "../../../infrastructure/repositories/mongodb/TransactionRepository";
import { GetAllTransactionsController } from "./GetAllTransactionsController";
import { CreateTransactionController } from "./CreateTransactionController";

// Repository
const transaction_repository = new TransactionRepository();

// Use Cases
const getAllTransactions = new GetAllTransactionsUseCase(transaction_repository);
const createTranasction = new CreateTransactionUseCase(transaction_repository);

// Controllers
export const getAllTransactionsController = new GetAllTransactionsController(getAllTransactions);
export const createTransactionController = new CreateTransactionController(createTranasction);