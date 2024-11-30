import { IUserRepository } from "src/application/ports/repositories/IUserRepository";
import { CreateUserInput, UserObject } from "./interfaces.ts/common";
import { ICreateUserUseCase, ICreateUseUseCaseResult } from "./interfaces.ts/ICreateUserUseCase";
import { UserEntity } from "../../../domain/entities/UserEntity";
import { IPasswordHasher } from "src/application/ports/services/IPasswordHasher";

export class CreateUserUseCase implements ICreateUserUseCase {
    constructor(
        private readonly repository: IUserRepository,
        private readonly password_service: IPasswordHasher
    ) {}

    public async execute(input: CreateUserInput): ICreateUseUseCaseResult {
        const userEntity = UserEntity.create(input);
        const isValid = userEntity.validateEmail();

        if (!isValid) return {
            errors: [{ message: "Invalid email", field: "email" }],
            result: null
        }

        const hashed_password = await this.password_service.hash(userEntity.getPassword());
        const inserted_id = await this.repository.create({
            email: userEntity.getEmail(),
            name: userEntity.getName(),
            lastname: userEntity.getLastName(),
            password: hashed_password
        });

        const inserted_user = await this.repository.retrieve(inserted_id);

        return {
            errors: [],
            result: inserted_user
        }
    }
}