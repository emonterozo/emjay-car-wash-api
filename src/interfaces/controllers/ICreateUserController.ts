import { ControllerResponse } from "./common";

// CreateUserController inputs maps the input from the request
export interface CreateUserControllerInput {
    FirstName: string;
    LastName: string;
    Email: string;
    Password: string;
}

export interface CreateUserControllerOutput {
    Id: string;
    FirstName: string;
    LastName: string;
    Email: string;
}

export interface ICreateUserController {
    handle(input: CreateUserControllerInput): Promise<ControllerResponse<CreateUserControllerOutput | null>>
}