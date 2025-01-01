import { Condition, OrderBy, Range } from "src/application/ports/repositories/common";
import { UseCaseResult } from "../../common";
import { TransactionObject } from "./common";

export interface IGetAllTransactionsParams {
  limit?: number;
  offset?: number;
  order_by?: OrderBy<keyof TransactionObject>;
  and_conditions?: Condition[];
  or_conditions?: Condition[];
  range?: Range;
}

export type IGetAllTransactionsResult = UseCaseResult<{ transactions: TransactionObject[] }>

export interface IGetAllTransactionsUseCase {
  execute(params?: IGetAllTransactionsParams): Promise<IGetAllTransactionsResult>
}