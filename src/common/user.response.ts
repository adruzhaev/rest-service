import { IUser } from '../services/user.interface';

export const toResponse = (user: IUser): Omit<IUser, 'password'> => {
    const { id, login, age } = user;
    return { id, login, age };
};
