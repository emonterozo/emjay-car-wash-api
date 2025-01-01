import { TransactionObject } from "src/application/use-cases/transactions/interfaces/common"
import { ControllerResponse } from "../common"

export type IGetAllTransactionsControllerResult = ControllerResponse<{ transactions: TransactionObject[] } | null>

export interface IGetAllTransactionsController {
  handle(token: string): Promise<IGetAllTransactionsControllerResult>
}