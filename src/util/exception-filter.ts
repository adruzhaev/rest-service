import { Request, Response, NextFunction } from 'express';
import { HttpCode } from '../constants/http-code';
import { winstonLogger } from './logger';

export const exceptionFilter = (err: Error, req: Request, res: Response, next: NextFunction) => {
    winstonLogger.error({ err: err.message });
    res.status(HttpCode.SERVER_ERROR).send({ err: err.message });
};
