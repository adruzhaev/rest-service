import { Secret } from 'jsonwebtoken';

export const ENV = {
    SECRET: process.env.SECRET as Secret,
    PORT: Number(process.env.PORT),
    USER_NAME: process.env.USER_NAME,
    PASSWORD: process.env.PASSWORD,
    DB: process.env.DB,
    HOST: process.env.HOST
} as const;
