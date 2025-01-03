import { TransactionObject } from "src/application/use-cases/transactions/interfaces/common"
import { ControllerResponse } from "../common"
import { Condition, Range } from "src/application/ports/repositories/common"

export type IGetAllTransactionsControllerResult = ControllerResponse<{ transactions: TransactionObject[] } | null>

export interface IGetAllTransactionsController {
  handle(token: string, params: { range: Range; and_conditions: Condition[]; or_conditions: Condition[] }): Promise<IGetAllTransactionsControllerResult>
}