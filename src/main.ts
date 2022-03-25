import 'reflect-metadata';
import { App } from './app';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { mockData } from './util/mock-data';
import { createConnection } from 'typeorm';
import { User } from './models/user.model';

const bootstrap = async () => {
    await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'andrew',
        password: 'new_password',
        database: 'andrew',
        synchronize: true,
        entities: [User]
    });

    const app = new App(new UserController(new UserService(mockData)));
    await app.init();
};

bootstrap();
