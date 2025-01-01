import { ITransactionRepository } from "src/application/ports/repositories/ITransactionRepository";
import { IGetAllTransactionsResult, IGetAllTransactionsParams, IGetAllTransactionsUseCase } from "./interfaces/IGetAllTransactionUseCase";

export class GetAllTransactionsUseCase implements IGetAllTransactionsUseCase {
  public constructor(private readonly _transaction_repository: ITransactionRepository) { }

  public async execute(params?: IGetAllTransactionsParams): Promise<IGetAllTransactionsResult> {

    const options: IGetAllTransactionsParams = {
      limit: params?.limit ?? 0,
      offset: params?.offset ?? 0,
      and_conditions: params?.and_conditions ?? [],
      or_conditions: params?.or_conditions ?? [],
      order_by: params?.order_by ?? { field: 'completed_on', direction: 'desc' },
      range: params?.range
    }

    const transactions = await this._transaction_repository.findAll(options);

    return {
      errors: [],
      result: {
        transactions: transactions
      }
    }
  }
}