import { Condition, Range } from "src/application/ports/repositories/common";
import { IGetAllTransactionsUseCase } from "src/application/use-cases/transactions/interfaces/IGetAllTransactionUseCase";
import { IGetAllTransactionsController, IGetAllTransactionsControllerResult } from "src/interfaces/controllers/transactions/IGetAllTransactionsController";

export class GetAllTransactionsController implements IGetAllTransactionsController {

  public constructor(private readonly _get_all_transactions: IGetAllTransactionsUseCase) { }

  public async handle(token: string, params: { range: Range; and_conditions: Condition[]; or_conditions: Condition[] }): Promise<IGetAllTransactionsControllerResult> {

    const response = await this._get_all_transactions.execute(params);

    return {
      data: {
        transactions: response.result.transactions
      },
      errors: []
    }
  }
}