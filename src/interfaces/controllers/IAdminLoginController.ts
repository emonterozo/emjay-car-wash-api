import { ControllerResponse } from "./common";

export interface AdminLoginControllerInput {
    username: string;
    password: string;
}

export type AdminLoginControllerOutput = ControllerResponse<{
    token: string | null
    user: {
        id: string;
        type: string;
        username: string;
    } | null;
}>

export interface IAdminLoginController {
    handle(input: AdminLoginControllerInput): Promise<AdminLoginControllerOutput>
}