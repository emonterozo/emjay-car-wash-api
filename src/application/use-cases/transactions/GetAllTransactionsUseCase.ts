import { ITransactionRepository } from "src/application/ports/repositories/ITransactionRepository";
import { IGetAllTransactionsResult, IGetAllTransactionsParams, IGetAllTransactionsUseCase } from "./interfaces/IGetAllTransactionUseCase";

export class GetAllTransactionsUseCase implements IGetAllTransactionsUseCase {
  public constructor(private readonly _transaction_repository: ITransactionRepository) { }

  public async execute(params?: IGetAllTransactionsParams): Promise<IGetAllTransactionsResult> {

    console.log(params?.range);
    
    const range_start = new Date(params?.range?.start ?? "2024-01-01");
    const range_end = new Date(params?.range?.end ?? "");

    range_start.setHours(0, 0, 0, 0)
    range_end.setHours(23, 59, 59, 59);

    const options: IGetAllTransactionsParams = {
      limit: params?.limit ?? 0,
      offset: params?.offset ?? 0,
      and_conditions: params?.and_conditions ?? [],
      or_conditions: params?.or_conditions ?? [],
      order_by: params?.order_by ?? { field: 'completed_on', direction: 'desc' },
      range: {
        field: params?.range?.field ?? 'completed_on',
        start: range_start,
        end: range_end,
      }
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