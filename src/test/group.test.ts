import { GroupService } from '../services/group.service';
import { IGroup } from '../services/group.interface';
import { GroupRepository } from '../repository/group.repostitory';
import { UserRepository } from '../repository/user.repositoty';
import { Group } from '../models/group.model';

let groupService: GroupService;

const mockData: IGroup[] = [
    {
        id: '1',
        name: 'Group_1',
        permissions: ['READ', 'WRITE']
    },
    {
        id: '2',
        name: 'Group_2',
        permissions: ['DELETE', 'WRITE']
    }
];

const GroupRepositoryMock = {
    find: jest.fn(),
    getOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn()
};

const UsersRepositoryMock = {};

describe('Group service methods', () => {
    beforeEach(async () => {
        groupService = new GroupService(
            mockData,
            GroupRepositoryMock as unknown as GroupRepository,
            UsersRepositoryMock as unknown as UserRepository
        );
    });

    test('get all groups', async () => {
        GroupRepositoryMock.find = jest.fn().mockImplementationOnce(
            () => (mockData)
        );

        const result = await groupService.getAll();
        expect(result.length).toBe(2);
    });

    test('get one group', async () => {
        GroupRepositoryMock.getOne = jest.fn().mockImplementationOnce(
            (id: string) => (Object.assign({}, ...mockData.filter((item) => item.id === id)))
        );

        const result = await groupService.getOne('2');
        expect(result?.id).toBe('2');
    });

    test('create group', async () => {
        GroupRepositoryMock.save = jest.fn().mockImplementationOnce(
            (group: Group) => ({
                id: group.id,
                name: group.name,
                permissions: group.permissions
            })
        );

        const result = await groupService.create({ id: '3', name: 'Group_3', permissions: ['READ'], users: [] });
        expect(result.id).toBe('3');
    });

    test('delete group', async () => {
        GroupRepositoryMock.getOne = jest.fn().mockImplementationOnce(
            (id: string) => (Object.assign({}, ...mockData.filter((item) => item.id === id)))
        );

        GroupRepositoryMock.delete = jest.fn().mockImplementationOnce(
            (id: string) => (mockData.filter((item) => item.id !== id))
        );

        const groups = await groupService.delete('1') as unknown as Group[];
        expect(groups.length).toBe(1);
    });
});
