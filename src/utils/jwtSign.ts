import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

type User = {
  id: string;
  username: string;
  type: string;
};

export const jwtSign = (user: User) => {
  const accessToken = jwt.sign({ user }, process.env.TOKEN_SECRET!, {
    expiresIn: '1m',
  });

  const refreshToken = jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: '7d',
  });

  return { accessToken, refreshToken };
};
