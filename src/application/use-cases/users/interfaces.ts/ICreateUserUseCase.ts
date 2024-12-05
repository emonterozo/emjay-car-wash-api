import { UseCaseResult } from "../../common";
import { CreateUserInput, UserObject } from "./common";

export type ICreateUseUseCaseResult = Promise<UseCaseResult<Omit<UserObject, 'password'> | null>>

export interface ICreateUserUseCase {
    execute(input: CreateUserInput): ICreateUseUseCaseResult;
}