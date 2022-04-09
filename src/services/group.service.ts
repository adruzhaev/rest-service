import 'reflect-metadata';
import { IGroup } from './group.interface';
import { GroupRepository } from '../repository/group.repostitory';
import { getConnection } from 'typeorm';
import { Group } from '../models/group.model';
import { UserRepository } from '../repository/user.repositoty';
import { IUser } from './user.interface';

export class GroupService {
    groups: IGroup[];
    // users: IUser[];
    groupRepository: GroupRepository;
    userRepository: UserRepository;

    constructor(groups: IGroup[]) {
        this.groups = groups;
        // this.users = users;
        this.groupRepository = getConnection().getCustomRepository(GroupRepository);
        this.userRepository = getConnection().getCustomRepository(UserRepository);
    }

    async create(group: Group) {
        return await this.groupRepository.save(group);
    }

    async getOne(id: string) {
        return await this.groupRepository.getOne(id);
    }

    async getAll() {
        return await this.groupRepository.find();
    }

    async update(id: any, group: IGroup) {
        return await this.groupRepository.update(id, group);
    }

    async delete(id: string) {
        return await this.groupRepository.delete(id);
    }

    async addUsersToGroup(groupId: string, userIds: string[]) {
        const users = await this.userRepository.findByIds(userIds);
        const group = await this.groupRepository.findOne(groupId);

        if (group) {
            group.users = users;
            return await this.groupRepository.save(group);
        }

        return console.error('No groups!');
    }
}
