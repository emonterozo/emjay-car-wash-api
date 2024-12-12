import { UserType } from "src/application/use-cases/users/interfaces.ts/common";
import { ICreateUserUseCase } from "src/application/use-cases/users/interfaces.ts/ICreateUserUseCase";
import { ControllerResponse } from "src/interfaces/controllers/common";
import { CreateUserControllerInput, CreateUserControllerOutput, ICreateUserController } from "src/interfaces/controllers/ICreateUserController";

export class CreateUserController implements ICreateUserController {

    constructor(private readonly usecase: ICreateUserUseCase) { }

    async handle(input: CreateUserControllerInput): Promise<ControllerResponse<CreateUserControllerOutput | null>> {
        
        // Some validations here...
        if (input.Type !== "ADMIN" && input.Type !== "SUPERVISOR") return {
            data: null,
            errors: [{ message: "Invalid type. Should be ADMIN or SUPERVISOR", field: "type" }]
        }

        const { errors, result } = await this.usecase.execute({
            type: input.Type as UserType,
            password: input.Password,
            username: input.Username
        });

        if (!result) return {
            data: null,
            errors: errors
        }

        return {
            errors: [],
            data: {
                Id: result.id,
                Type: result.type,
                Username: result.username
            },
        }
    }
}