import bcrypt from 'bcrypt';

import Account from '../models/accountModel';
import { jwtSign } from '../utils/jwtSign';

export const authenticateUser = async (username: string, password: string) => {
  try {
    const user = await Account.findOne({ username: username });

    if (!user) {
      return {
        success: false,
        status: 404,
        error: {
          field: 'username',
          message: 'User not found',
        },
      };
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return {
        success: false,
        status: 401,
        error: {
          field: 'password',
          message: 'Invalid password',
        },
      };
    }

    const userData = { id: user._id.toString(), username: user.username, type: user.type };

    const { accessToken, refreshToken } = jwtSign(userData);

    return {
      success: true,
      user: userData,
      accessToken,
      refreshToken,
    };
  } catch (error: any) {
    return {
      success: false,
      status: 500,
      error: {
        field: 'general',
        message: 'An unexpected error occurred during authentication',
      },
    };
  }
};
