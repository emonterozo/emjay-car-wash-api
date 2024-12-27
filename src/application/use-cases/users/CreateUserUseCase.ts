import { IUserRepository } from '../../../application/ports/repositories/IUserRepository';
import { CreateUserInput, UserType } from './interfaces.ts/common';
import { ICreateUserUseCase, ICreateUseUseCaseResult } from './interfaces.ts/ICreateUserUseCase';
import { UserEntity } from '../../../domain/entities/UserEntity';
import { IPasswordHasher } from '../../../application/ports/services/IPasswordHasher';
import { ErrorMessage } from '../../../application/ports/common';

export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(
    private readonly repository: IUserRepository,
    private readonly password_service: IPasswordHasher,
  ) {}

  public async execute(input: CreateUserInput): ICreateUseUseCaseResult {
    const userEntity = UserEntity.create(input);
    const validation_errors: ErrorMessage[] = [];

    // Validates user input fields
    const usernameErrMsg = userEntity.validateUsername();
    const passwordErrMsg = userEntity.validatePassword();

    if (usernameErrMsg) validation_errors.push({ field: 'username', message: usernameErrMsg });

    if (passwordErrMsg) validation_errors.push({ field: 'password', message: passwordErrMsg });

    // If one of input values is invalid return immediately
    if (validation_errors.length) return { result: null, errors: validation_errors };

    // Hashes the validated password
    const hashed_password = await this.password_service.hash(userEntity.getPassword());

    // Saves the validated inputs
    const inserted_id = await this.repository.create({
      type: userEntity.getUserType() as UserType,
      password: hashed_password,
      username: userEntity.getUsername(),
    });

    // Retrieves newly inserted user
    const inserted_user = await this.repository.retrieve(inserted_id);

    return {
      errors: [],
      result: inserted_user,
    };
  }
}
