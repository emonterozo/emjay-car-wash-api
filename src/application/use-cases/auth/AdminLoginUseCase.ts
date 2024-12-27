import { IUserRepository } from '../../../application/ports/repositories/IUserRepository';
import { IAdminLoginUseCase, AdminLoginUseCaseResponse } from './interfaces/IAdminLoginUseCase';
import { IPasswordHasher } from '../../../application/ports/services/IPasswordHasher';
import { ITokenService } from '../../../application/ports/services/ITokenService';

export class AdminLoginUseCase implements IAdminLoginUseCase {
  constructor(
    private readonly repository: IUserRepository,
    private readonly password_service: IPasswordHasher,
    private readonly token_service: ITokenService,
  ) {}

  public async execute(username: string, password: string): Promise<AdminLoginUseCaseResponse> {
    // Gets the user from datasource
    const user = await this.repository.findOneBy([
      {
        field: 'username',
        value: username,
      },
    ]);

    // If user doesn't exist, return error
    if (!user)
      return {
        errors: [{ field: 'username', message: 'User not found' }],
        result: { user: null, token: null },
      };

    // Check if provided password is correct
    const is_password_matched = await this.password_service.compare(password, user.password);

    // If password is incorrect, return error
    if (!is_password_matched)
      return {
        errors: [{ field: 'password', message: 'Password is incorrect' }],
        result: { user: null, token: null },
      };

    // Removes password from user object
    const { password: _omit_password, ...user_obj } = user;

    // Generates auth token
    const auth_token = await this.token_service.generate(user_obj);

    // Return user and token
    return {
      errors: [],
      result: { user: user_obj, token: auth_token },
    };
  }
}
