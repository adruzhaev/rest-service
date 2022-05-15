import express from 'express';
import { Connection, createConnection } from 'typeorm';
import { Express } from 'express-serve-static-core';
import { ENV } from '../constants/env';
import { Group } from '../models/group.model';
import { User } from '../models/user.model';
import { GroupService } from '../services/group.service';
import { groupsMockData } from '../util/groups-mock-data';
import { GroupController } from '../controllers/group.controller';

let app: Express;
let groupService: GroupService;
let groupController: GroupController;
let connection: Connection;
let result;

describe('Group', () => {
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

        groupService = new GroupService(groupsMockData);
        groupController = new GroupController(groupService);
        app = express();
        app.use(express.json());
        app.use('/groups', groupController.router);
    });

    afterEach(() => {
        connection.close();
    });

    test('get all users', async () => {
        result = await groupService.getAll();
        expect(result.length).toBe(7);
    });

    test('get user by id', async () => {
        result = await groupService.getOne('2');
        expect(result?.id).toBe(2);
    });
});
