import { Condition, OrderBy, Range } from "src/application/ports/repositories/common";
import { UseCaseResult } from "../../common";
import { TransactionObject, AvailedService } from "./common";

type ConcatKeyWithString<T, S extends string> = `${S}.${keyof T & string}`;

export interface IGetAllTransactionsParams {
  limit?: number;
  offset?: number;
  order_by?: OrderBy<keyof Omit<TransactionObject, 'services'> | ConcatKeyWithString<AvailedService, 'services'>>;
  and_conditions?: Condition<keyof Omit<TransactionObject, 'services'> | ConcatKeyWithString<AvailedService, 'services'>>[];
  or_conditions?: Condition<keyof Omit<TransactionObject, 'services'> | ConcatKeyWithString<AvailedService, 'services'>>[];
  not?: Condition<keyof Omit<TransactionObject, 'services'> | ConcatKeyWithString<AvailedService, 'services'>>[];
  range?: Range;
}

export type IGetAllTransactionsResult = UseCaseResult<{ transactions: TransactionObject[] }>

export interface IGetAllTransactionsUseCase {
  execute(params?: IGetAllTransactionsParams): Promise<IGetAllTransactionsResult>
}