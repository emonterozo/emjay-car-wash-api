import winston from 'winston';
import { Request } from 'express';
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';
import dotenv from 'dotenv';

dotenv.config();

type LogWithContextProps = {
  level: 'info' | 'error' | 'warn';
  message: string;
  req?: Request;
  file: string;
  data: any;
  errors: any;
};

const logtail = new Logtail(process.env.LOG_TAIL_SOURCE_TOKEN!);

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new LogtailTransport(logtail), new winston.transports.Console()],
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
    method: req ? req.method : 'unknown',
    path: req ? req.originalUrl : 'unknown',
    file,
    userAgent: req ? req.get('User-Agent') : 'unknown',
    data: data,
    errors: errors,
  });
};

logtail.flush();
