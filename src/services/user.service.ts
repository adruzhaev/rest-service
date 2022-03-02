import 'reflect-metadata';
import { IUser } from './user.interface';
import { UserRepository } from '../repository/user.repositoty';
import { getConnection, Like } from 'typeorm';
import { User } from '../models/user.model';

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
        return await this.userRepository.findOne({ where: { id } });
    }

    async getAll() {
        return await this.userRepository.find();
    }

    async getAutoSuggestUsers(loginSubstring: string, limit: string) {
        return await this.userRepository.find({
            take: Number(limit),
            where: { login: Like(`%${loginSubstring}%`) },
            order: {
                login: 'ASC'
            }
        });
    }

    async update(id: any, user: IUser) {
        return await this.userRepository.update(id, user);
    }

    async delete(id: string) {
        return await this.userRepository.softDelete(id);
    }
}
