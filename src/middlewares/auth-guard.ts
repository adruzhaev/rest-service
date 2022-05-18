/* eslint-disable callback-return */
import { Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { ENV } from '../constants/env';
import { HttpCode } from '../constants/http-code';
import { winstonLogger } from '../util/logger';

export class AuthGuard {
    execute(req: any, res: Response, next: NextFunction) {
        return new Promise((resolve, reject) => {
            if (req.headers.authorization) {
                verify(req.headers.authorization.split(' ')[1], ENV.SECRET, (err: any, payload: any) => {
                    if (err) {
                        winstonLogger.error(`${HttpCode.FORBIDDEN} Invalid JWT token`);
                        reject(err);
                    } else if (payload) {
                        resolve(payload);
                        next();
                    }
                });
            } else {
                winstonLogger.error(`${HttpCode.NOT_AUTHORIZED} You are not authorized`);
                reject();
            }
        });
    }
}
