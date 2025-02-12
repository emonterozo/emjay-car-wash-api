import { Response } from 'express';

export const sendValidationError = (res: Response, field: string, message: string) => {
  return res.status(400).json({
    data: null,
    errors: [
      {
        field,
        message,
      },
    ],
  });
};
