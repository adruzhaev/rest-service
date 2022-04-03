import 'reflect-metadata';
import { IGroup } from './group.interface';
import { GroupRepository } from '../repository/group.repostitory';
import { getConnection } from 'typeorm';
import { Group } from '../models/group.model';

export class GroupService {
    groups: IGroup[];
    groupRepository: GroupRepository;

    constructor(groups: IGroup[]) {
        this.groups = groups;
        this.groupRepository = getConnection().getCustomRepository(GroupRepository);
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

    async update(id: any, user: IGroup) {
        return await this.groupRepository.update(id, user);
    }

    async delete(id: string) {
        return await this.groupRepository.delete(id);
    }
}
