import express, { Express } from 'express';
import { Server } from 'http';
import { UserController } from './controllers/user.controller';
import { GroupController } from './controllers/group.controller';

export class App {
    app: Express;
    port: number;
    server: Server;
    userController: UserController;
    groupController: GroupController;

    constructor(userController: UserController, groupController: GroupController) {
        this.app = express();
        this.port = 8000;
        this.userController = userController;
        this.groupController = groupController;
    }

    async useRoutes() {
        this.app.use('/users', this.userController.router);
        this.app.use('/groups', this.groupController.router);
    }

    useMiddlewares() {
        this.app.use(express.json());
    }

    public async init() {
        this.useMiddlewares();
        this.useRoutes();
        this.server = this.app.listen(this.port);
        console.log(`Server is started on port: ${this.port}`);
    }
}
