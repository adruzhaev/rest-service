import express from 'express';
import { Connection, createConnection } from 'typeorm';
import { UserService } from '../services/user.service';
import { Express } from 'express-serve-static-core';
import { ENV } from '../constants/env';
import { Group } from '../models/group.model';
import { User } from '../models/user.model';
import { UserController } from '../controllers/user.controller';
import { usersMockData } from '../util/users-mock-data';

let app: Express;
let userService: UserService;
let userController: UserController;
let connection: Connection;
let result;

describe('User', () => {
    beforeEach(async () => {
        connection = await createConnection({
            type: 'postgres',
            host: ENV.HOST,
            port: ENV.PORT,
            username: ENV.USER_NAME,
            password: ENV.PASSWORD,
            database: ENV.DB,
            synchronize: true,
            entities: [User, Group]
        });

        userService = new UserService(usersMockData);
        userController = new UserController(userService);
        app = express();
        app.use(express.json());
        app.use('/users', userController.router);
    });

    afterEach(() => {
        connection.close();
    });

    test('get all users', async () => {
        result = await userService.getAll();
        expect(result.length).toBe(11);
    });

    test('get user by id', async () => {
        result = await userService.getOne('6');
        expect(result.id).toBe(6);
    });
});
