import { TransactionObject } from "src/application/use-cases/transactions/interfaces/common"
import { ControllerResponse } from "../common"
import { Condition, Range } from "src/application/ports/repositories/common"
import { IGetAllTransactionsParams } from "src/application/use-cases/transactions/interfaces/IGetAllTransactionUseCase"

export type IGetAllTransactionsControllerResult = ControllerResponse<{ transactions: TransactionObject[] } | null>

export interface IGetAllTransactionsController {
  handle(token: string, params: IGetAllTransactionsParams): Promise<IGetAllTransactionsControllerResult>
}