import { TransactionObject } from "src/application/use-cases/transactions/interfaces/common"
import { ControllerResponse } from "../common"
import { Range } from "src/application/ports/repositories/common"

export type IGetAllTransactionsControllerResult = ControllerResponse<{ transactions: TransactionObject[] } | null>

export interface IGetAllTransactionsController {
  handle(token: string, params: { range: Range }): Promise<IGetAllTransactionsControllerResult>
}