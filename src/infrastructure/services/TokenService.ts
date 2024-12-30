import { AuthToken, ITokenService } from '../../application/ports/services/ITokenService';
import jwt from 'jsonwebtoken';

export class TokenService implements ITokenService {
  generate(payload: any, expiration = 60 * 60): Promise<string> {
    const token = jwt.sign(payload, process.env.TOKEN_SECRET!, {
      expiresIn: expiration,
    });

    return Promise.resolve(token);
  }

  public async verify(token: AuthToken): Promise<boolean> {
    try {
      jwt.verify(token, process.env.TOKEN_SECRET!);

      return Promise.resolve(true);
    } catch (error) {
      return Promise.resolve(false);
    }
  }
}
