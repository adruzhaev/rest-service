import express, { Express } from 'express';
import { Server } from 'http';
import { UserController } from './controllers/user.controller';
import { GroupController } from './controllers/group.controller';
import { logger, winstonLogger } from './util/logger';
import { exceptionFilter } from './util/exception-filter';
import cors from 'cors';

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
        this.app.use(logger);
        this.app.use(cors());
    }

    useExceptionFilter() {
        this.app.use(exceptionFilter);
    }

    public async init() {
        this.useMiddlewares();
        this.useExceptionFilter();
        this.useRoutes();
        this.server = this.app.listen(this.port);
        winstonLogger.info(`Server is started on port: ${this.port}`);

        process.on('unhandledRejection', (error: Error) => {
            winstonLogger.error(error.message);
        });

        process.on('uncaughtException', (error: Error) => {
            winstonLogger.error(error.message);
        });
    }
}
