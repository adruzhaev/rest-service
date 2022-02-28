import express, { Express } from 'express';
import { Server } from 'http';
import { UserController } from './controllers/user.controller';
import { json } from 'body-parser';

export class App {
    app: Express;
    port: number;
    server: Server;
    userController: UserController;

    constructor(userController: UserController) {
        this.app = express();
        this.port = 8000;
        this.userController = userController;
    }

    useRoutes() {
        this.app.use('/users', this.userController.router);
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
