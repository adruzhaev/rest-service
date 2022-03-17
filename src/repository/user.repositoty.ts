import { EntityRepository, Repository, Like } from 'typeorm';
import { User } from '../models/user.model';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async getAutoSuggestUsers(loginSubstring: string, limit: string) {
        return await this.find({
            take: Number(limit),
            where: { login: Like(`%${loginSubstring}%`) },
            order: {
                login: 'ASC'
            }
        });
    }
}
