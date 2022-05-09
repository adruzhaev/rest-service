import { Request, Response, NextFunction } from 'express';
import winston, { Logger, format } from 'winston';

export const winstonLogger: Logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: format.combine(
        format.timestamp(),
        format.cli(),
        format.printf(
            info => `[${info.timestamp}] ${info.level} ${info.message}`
        )
    ),
    transports: [new winston.transports.Console()],
    exitOnError: false
});

export const logger = (req: Request, res: Response, next: NextFunction) => {
    winstonLogger.info(`${req.method}: ${req.path}`);

    next();
};
