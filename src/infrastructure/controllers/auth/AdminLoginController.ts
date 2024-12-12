import { IAdminLoginUseCase } from "src/application/use-cases/auth/interfaces/IAdminLoginUseCase";
import { IAdminLoginController, AdminLoginControllerInput, AdminLoginControllerOutput } from "src/interfaces/controllers/IAdminLoginController";

export class AdminLoginController implements IAdminLoginController {

    constructor(private readonly login_usecase: IAdminLoginUseCase) { }

    async handle(input: AdminLoginControllerInput): Promise<AdminLoginControllerOutput> {

        const { errors, result } = await this.login_usecase.execute(input.username, input.password);

        if (!result.user) return {
            data: {
                user: null,
                token: null
            },
            errors
        }

        return {
            data: {
                token: result.token,
                user: {
                    id: result.user.id,
                    type: result.user.type,
                    username: result.user.username
                }
            },
            errors: []
        }
    }
}