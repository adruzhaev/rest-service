import 'reflect-metadata';
import { IUser } from './user.interface';
import { UserRepository } from '../repository/user.repositoty';
import { getConnection } from 'typeorm';
import { User } from '../models/user.model';
import { HTTPError } from '../common/error.class';
import { HttpCode } from '../constants/http-code';

export class UserService {
    users: IUser[];
    userRepository: UserRepository;

    constructor(users: IUser[]) {
        this.users = users.map(userService => {
            return Object.assign({}, { id: userService.id, age: userService.age, login: userService.login, password: userService.password });
        });

        this.userRepository = getConnection().getCustomRepository(UserRepository);
    }

    async create(user: User) {
        return await this.userRepository.save(user);
    }

    async getOne(id: string) {
        const existedUser = await this.userRepository.getOne(id);

        if (!existedUser) {
            throw new HTTPError(HttpCode.NOT_FOUND, 'User is not found');
        }

        return existedUser;
    }

    async getAll() {
        return await this.userRepository.find();
    }

    async getAutoSuggestUsers(loginSubstring: string, limit: string) {
        return await this.userRepository.getAutoSuggestUsers(loginSubstring, limit);
    }

    async update(id: any, user: IUser) {
        const existedUser = await this.userRepository.getOne(id);

        if (!existedUser) {
            throw new HTTPError(HttpCode.NOT_FOUND, 'User is not found');
        }

        return await this.userRepository.update(id, user);
    }

    async delete(id: string) {
        const existedUser = await this.userRepository.getOne(id);

        if (!existedUser) {
            throw new HTTPError(HttpCode.NOT_FOUND, 'User is not found');
        }

        return await this.userRepository.softDelete(id);
    }
}
