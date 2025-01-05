import { Condition, OrderBy, Range } from "src/application/ports/repositories/common";
import { UseCaseResult } from "../../common";
import { TransactionObject, TransactionService } from "./common";

type ConcatKeyWithString<T, S extends string> = `${S}.${keyof T & string}`;

export interface IGetAllTransactionsParams {
  limit?: number;
  offset?: number;
  order_by?: OrderBy<keyof Omit<TransactionObject, 'services'> | ConcatKeyWithString<TransactionService, 'services'>>;
  and_conditions?: Condition<keyof Omit<TransactionObject, 'services'> | ConcatKeyWithString<TransactionService, 'services'>>[];
  or_conditions?: Condition<keyof Omit<TransactionObject, 'services'> | ConcatKeyWithString<TransactionService, 'services'>>[];
  not?: Condition<keyof Omit<TransactionObject, 'services'> | ConcatKeyWithString<TransactionService, 'services'>>[];
  range?: Range;
}

export type IGetAllTransactionsResult = UseCaseResult<{ transactions: TransactionObject[] }>

export interface IGetAllTransactionsUseCase {
  execute(params?: IGetAllTransactionsParams): Promise<IGetAllTransactionsResult>
}