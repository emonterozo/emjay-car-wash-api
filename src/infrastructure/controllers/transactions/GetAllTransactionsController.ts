import { IGetAllTransactionsUseCase } from "src/application/use-cases/transactions/interfaces/IGetAllTransactionUseCase";
import { IGetAllTransactionsController, IGetAllTransactionsControllerResult } from "src/interfaces/controllers/transactions/IGetAllTransactionsController";

export class GetAllTransactionsController implements IGetAllTransactionsController {

  public constructor(private readonly _get_all_transactions: IGetAllTransactionsUseCase) {}

  public async handle(token: string): Promise<IGetAllTransactionsControllerResult> {

    const response = await this._get_all_transactions.execute();

    return {
      data: {
        transactions: response.result.transactions
      },
      errors: []
    }
  }
}