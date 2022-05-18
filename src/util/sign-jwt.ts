import { Secret, sign } from 'jsonwebtoken';

export const signJWT = (name: string, password: string, secret: Secret) => {
    return new Promise((resolve, reject) => {
        sign(
            {
                name,
                password
            },
            secret,
            {
                algorithm: 'HS256'
            },
            (err, token) => {
                if (err) {
                    reject(err);
                }

                resolve(token as string);
            }
        );
    });
};
