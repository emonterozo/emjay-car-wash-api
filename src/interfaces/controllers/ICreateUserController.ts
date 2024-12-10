import { UserType } from "src/application/use-cases/users/interfaces.ts/common";
import { ControllerResponse } from "./common";

// CreateUserController inputs maps the input from the request
export interface CreateUserControllerInput {
    Type: UserType;
    Password: string;
    Username: string;
}

export interface CreateUserControllerOutput {
    Id: string;
    Type: UserType;
    Username: string;
}

export interface ICreateUserController {
    handle(input: CreateUserControllerInput): Promise<ControllerResponse<CreateUserControllerOutput | null>>
}