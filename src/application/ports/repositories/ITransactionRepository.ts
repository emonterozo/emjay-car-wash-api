import { TransactionObject } from "src/application/use-cases/transactions/interfaces/common";
import { IGetAllTransactionsParams } from "src/application/use-cases/transactions/interfaces/IGetAllTransactionUseCase";

export interface ITransactionRepository {
  findAll(params?: IGetAllTransactionsParams): Promise<TransactionObject[]>;
}