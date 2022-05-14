import 'reflect-metadata';
import 'dotenv/config';
import { App } from './app';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { GroupController } from './controllers/group.controller';
import { GroupService } from './services/group.service';
import { usersMockData } from './util/users-mock-data';
import { groupsMockData } from './util/groups-mock-data';
import { createConnection } from 'typeorm';
import { User } from './models/user.model';
import { Group } from './models/group.model';

const bootstrap = async () => {
    await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'andrew',
        password: 'new_password',
        database: 'andrew',
        synchronize: true,
        entities: [User, Group]
    });

    const app = new App(new UserController(new UserService(usersMockData)), new GroupController(new GroupService(groupsMockData)));
    await app.init();
};

bootstrap();
