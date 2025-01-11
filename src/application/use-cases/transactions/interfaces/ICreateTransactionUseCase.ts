import { UseCaseResult } from "../../common";
import { CreateTransactionInput } from "./common";

export interface ICreateTransactionUseCase {
    execute(input: CreateTransactionInput): Promise<UseCaseResult<{ success: boolean }>>
}