import 'reflect-metadata';
import 'dotenv/config';
import { App } from './app';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { GroupController } from './controllers/group.controller';
import { GroupService } from './services/group.service';
import { usersMockData } from './util/users-mock-data';
import { groupsMockData } from './util/groups-mock-data';
import { createConnection, getConnection } from 'typeorm';
import { User } from './models/user.model';
import { Group } from './models/group.model';
import { ENV } from './constants/env';
import { UserRepository } from './repository/user.repositoty';

const bootstrap = async () => {
    await createConnection({
        type: 'postgres',
        host: ENV.HOST,
        port: ENV.PORT,
        username: ENV.USER_NAME,
        password: ENV.PASSWORD,
        database: ENV.DB,
        synchronize: true,
        entities: [User, Group]
    });

    const app = new App(new UserController(
        new UserService(usersMockData, getConnection().getCustomRepository(UserRepository))),
    new GroupController(new GroupService(groupsMockData))
    );
    await app.init();
};

bootstrap();
