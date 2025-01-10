import { Condition, Range } from "../../../application/ports/repositories/common";
import { ITokenService } from "../../../application/ports/services/ITokenService";
import { IGetAllTransactionsParams, IGetAllTransactionsUseCase } from "../../../application/use-cases/transactions/interfaces/IGetAllTransactionUseCase";
import { IGetAllTransactionsController, IGetAllTransactionsControllerResult } from "../../../interfaces/controllers/transactions/IGetAllTransactionsController";

export class GetAllTransactionsController implements IGetAllTransactionsController {

  public constructor(
    private readonly _get_all_transactions: IGetAllTransactionsUseCase,
    private readonly _token_service: ITokenService
  ) { }

  public async handle(token: string, params: IGetAllTransactionsParams): Promise<IGetAllTransactionsControllerResult> {
    const is_valid_token = await this._token_service.verify(token);

    if (!is_valid_token) return {
      data: null,
      errors: [{ field: 'unknown', message: 'UNAUTHENTICATED_REQUEST' }]
    };


    const response = await this._get_all_transactions.execute(params);

    return {
      data: {
        transactions: response.result.transactions
      },
      errors: []
    }
  }
}