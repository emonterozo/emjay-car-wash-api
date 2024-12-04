import { ICreateUserUseCase } from "src/application/use-cases/users/interfaces.ts/ICreateUserUseCase";
import { ControllerResponse } from "src/interfaces/controllers/common";
import { CreateUserControllerInput, CreateUserControllerOutput, ICreateUserController } from "src/interfaces/controllers/ICreateUserController";

export class CreateUserController implements ICreateUserController {

    constructor(private readonly usecase: ICreateUserUseCase) { }

    async handle(input: CreateUserControllerInput): Promise<ControllerResponse<CreateUserControllerOutput | null>> {
        
        // Some validations here...

        const { errors, result } = await this.usecase.execute({
            name: input.FirstName,
            lastname: input.LastName,
            email: input.Email,
            password: input.Password
        });

        if (!result) return {
            data: null,
            errors: errors
        }

        return {
            errors: [],
            data: {
                Id: result.id,
                Email: result.email,
                FirstName: result.name,
                LastName: result.lastname
            },
        }
    }
}