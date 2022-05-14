/* eslint-disable callback-return */
import { Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { HttpCode } from '../constants/http-code';
import { winstonLogger } from '../util/logger';

export class AuthGuard {
    execute(req: any, res: Response, next: NextFunction): void {
        if (req.headers.authorization) {
            verify(req.headers.authorization.split(' ')[1], 'secret', (err: any, payload: any) => {
                if (err) {
                    winstonLogger.error(`${HttpCode.FORBIDDEN} Invalid JWT token`);
                    throw new Error(err);
                } else if (payload) {
                    next();
                }
            });
        } else {
            winstonLogger.error(`${HttpCode.NOT_AUTHORIZED} You are not authorized`);
            throw new Error('You are not authorized');
        }
    }
}
