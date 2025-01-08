import { ITransactionRepository } from "src/application/ports/repositories/ITransactionRepository";
import { IGetAllTransactionsResult, IGetAllTransactionsParams, IGetAllTransactionsUseCase } from "./interfaces/IGetAllTransactionUseCase";

export class GetAllTransactionsUseCase implements IGetAllTransactionsUseCase {
  public constructor(private readonly _transaction_repository: ITransactionRepository) { }

  public async execute(params?: IGetAllTransactionsParams): Promise<IGetAllTransactionsResult> {

    let range_start = params?.range?.start;
    let range_end = params?.range?.end;

    if (!params?.range?.field || params?.range?.field === 'check_in' /*|| params?.range?.field === 'check_in'*/) {
      range_start = new Date(params?.range?.start ?? "2024-01-01");
      range_end = new Date(params?.range?.end ?? Date.now());
      range_start.setHours(0, 0, 0, 0)
      range_end.setHours(23, 59, 59, 59);
    }

    const and = params?.and_conditions?.map(condition => {
      if (condition.field === 'completed_on' || condition.field === 'check_in') {
        return {
          field: condition.field,
          value: new Date(condition.value)
        }
      }

      return condition
    })

    const or = params?.or_conditions?.map(condition => {
      if (condition.field === 'completed_on' || condition.field === 'check_in') {
        return {
          field: condition.field,
          value: new Date(condition.value)
        }
      }

      return condition
    })

    const options: IGetAllTransactionsParams = {
      limit: params?.limit ?? 0,
      offset: params?.offset ?? 0,
      and_conditions: and,
      or_conditions: or,
      order_by: params?.order_by ?? { field: 'check_in', direction: 'asc' },
      range: {
        field: params?.range?.field ?? 'check_in',
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