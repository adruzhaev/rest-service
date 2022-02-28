import { App } from './app';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.sevice';
import { mockData } from './util/mock-data';

const bootstrap = async () => {
    const app = new App(new UserController(new UserService(mockData)));
    await app.init();
};

bootstrap();
