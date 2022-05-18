import { User } from '../models/user.model';
import { UserRepository } from '../repository/user.repositoty';
import { IUser } from '../services/user.interface';
import { UserService } from '../services/user.service';

let userService: UserService;
let result;

const mockData: Array<User> = [
    {
        'id': '1',
        'login': 'Mark',
        'password': 'ssfasd',
        'deletedAt': null,
        'age': 33
    },
    {
        'id': '2',
        'login': 'Maria',
        'password': '123',
        'deletedAt': null,
        'age': 22
    }
];

const UsersRepositoryMock = {
    find: jest.fn(),
    getOne: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn()
};

beforeEach(() => {
    userService = new UserService(mockData, UsersRepositoryMock as unknown as UserRepository);
});

describe('User service methods', () => {
    test('get all users', async () => {
        UsersRepositoryMock.find = jest.fn().mockImplementationOnce(
            () => (mockData),
        );

        result = await userService.getAll();
        expect(result.length).toBe(2);
    });

    test('get one user', async () => {
        UsersRepositoryMock.getOne = jest.fn().mockImplementationOnce(
            (id: string) => (Object.assign({}, ...mockData.filter((item) => item.id === id)))
        );

        result = await userService.getOne('1');
        expect(result.id).toEqual('1');
    });

    test('create user', async () => {
        UsersRepositoryMock.save = jest.fn().mockImplementationOnce(
            (user: User) => ({
                id: user.id,
                login: user.login,
                password: user.password,
                age: user.age,
                deletedAt: user.deletedAt
            })
        );

        result = await userService.create({
            id: '1',
            login: 'Andrew',
            password: '123',
            age: 22,
            deletedAt: new Date()
        });

        expect(result.id).toEqual('1');
        expect(result.login).toEqual('Andrew');
    });

    test('delete user', async () => {
        UsersRepositoryMock.getOne = jest.fn().mockImplementationOnce(
            (id: string) => (Object.assign({}, ...mockData.filter((item) => item.id === id)))
        );

        UsersRepositoryMock.softDelete = jest.fn().mockImplementationOnce(
            (id: string): User => {
                const userToDelete: IUser = Object.assign({}, ...mockData.filter((item) => item.id === id));
                return {
                    ...userToDelete,
                    deletedAt: new Date('2022-05-18T17:10:28.517Z')
                };
            }
        );

        const user = await userService.delete('1') as unknown as User;
        expect(user.deletedAt).toEqual(new Date('2022-05-18T17:10:28.517Z'));
    });
});

