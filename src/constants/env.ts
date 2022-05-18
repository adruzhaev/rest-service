import { Secret } from 'jsonwebtoken';

export const ENV = {
    SECRET: process.env.SECRET as Secret
} as const;
