import winston from 'winston';
import { Request } from 'express';

type LogWithContextProps = {
  level: 'info' | 'error' | 'warn';
  message: string;
  req?: Request;
  file: string;
  data: any;
  errors: any;
};

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new winston.transports.Console()],
});

export const logWithContext = ({
  level,
  message,
  req,
  file,
  data,
  errors,
}: LogWithContextProps) => {
  logger.log(level, message, {
    method: req ? req.originalUrl : 'unknown',
    path: req ? req.originalUrl : 'unknown',
    file,
    userAgent: req ? req.get('User-Agent') : 'unknown',
    data: data,
    errors: errors,
  });
};
