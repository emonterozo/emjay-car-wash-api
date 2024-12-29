import { UseCaseResult } from "../../common";

export type IGetCustomersCountResult = UseCaseResult<{ total: number }>

export interface IGetCustomersCountUseCase {
  execute(): Promise<IGetCustomersCountResult>
}