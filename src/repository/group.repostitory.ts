import { EntityRepository, Repository } from 'typeorm';
import { Group } from '../models/group.model';

@EntityRepository(Group)
export class GroupRepository extends Repository<Group> {
    async getOne(id: string) {
        return await this.findOne({ where: { id } });
    }
}
