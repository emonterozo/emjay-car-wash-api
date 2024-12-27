import { ErrorMessage } from '../../../../application/ports/common';
import { UseCaseResult } from '../../common';
import { UserObject } from '../../users/interfaces.ts/common';
import { AuthToken } from '../../../../application/ports/services/ITokenService';

export type AdminLoginUseCaseResponse = UseCaseResult<{
  user: Omit<UserObject, 'password'> | null;
  token: AuthToken | null;
}>;

export interface IAdminLoginUseCase {
  execute(username: string, password: string): Promise<AdminLoginUseCaseResponse>;
}
