import 'reflect-metadata';
import { IGroup } from './group.interface';
import { GroupRepository } from '../repository/group.repostitory';
import { getConnection, getManager } from 'typeorm';
import { Group } from '../models/group.model';
import { UserRepository } from '../repository/user.repositoty';

export class GroupService {
    groups: IGroup[];
    groupRepository: GroupRepository;
    userRepository: UserRepository;

    constructor(groups: IGroup[]) {
        this.groups = groups;
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
        const existedGroup = await this.groupRepository.getOne(id);

        if (!existedGroup) {
            throw new Error('Group is not found');
        }

        return await this.groupRepository.update(id, group);
    }

    async delete(id: string) {
        return await this.groupRepository.delete(id);
    }

    async addUsersToGroup(groupId: string, userIds: string[]) {
        return await getManager().transaction(async (transactionalManager) => {
            const userRepository = transactionalManager.getCustomRepository(UserRepository);
            const groupRepository = transactionalManager.getCustomRepository(GroupRepository);
            const group = await groupRepository.findOne(groupId);
            const users = await userRepository.findByIds(userIds);

            if (group) {
                group.users = users;
                return await transactionalManager.save(group);
            }

            return console.error('No groups!');
        });
    }
}
