import * as Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { HttpCode } from '../constants/http-code';
import { createValidator, ExpressJoiInstance } from 'express-joi-validation';
import { IUserController } from './user.controller.interface';
import { BaseController } from '../common/base.controller';
import { toResponse } from '../common/user.response';
import { IUser } from '../services/user.interface';
import { winstonLogger } from '../util/logger';
import { signJWT } from '../util/sign-jwt';
import { AuthGuard } from '../middlewares/auth-guard';
import { ENV } from '../constants/env';

const querySchema = Joi.object({
    login: Joi.string().required(),
    password: Joi.string().regex(/^[a-z0-9]+$/).required(),
    age: Joi.number().min(4).max(130).required(),
    deletedAt: Joi.boolean()
});

export class UserController extends BaseController implements IUserController {
    userService: UserService;
    validator: ExpressJoiInstance;

    constructor(userService: UserService) {
        super();
        this.userService = userService;
        this.validator = createValidator();

        this.bindRoutes([
            {
                path: '/',
                method: 'get',
                func: this.getAllUsers,
                middlewares: [new AuthGuard().execute]
            },
            {
                path: '/:id',
                method: 'get',
                func: this.getOneUser,
                middlewares: [new AuthGuard().execute]
            },
            {
                path: '/',
                method: 'post',
                func: this.createUser,
                middlewares: [new AuthGuard().execute, this.validator.body(querySchema)]
            },
            {
                path: '/:id',
                method: 'put',
                func: this.updateUser,
                middlewares: [new AuthGuard().execute, this.validator.body(querySchema)]
            },
            {
                path: '/:id',
                method: 'delete',
                func: this.deleteUser,
                middlewares: [new AuthGuard().execute]
            },
            {
                path: '/login',
                method: 'post',
                func: this.login
            }
        ]);
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const { login, limit } = req.query;

            if (limit && login) {
                const limitedUsers = (await this.userService.getAutoSuggestUsers(login as string, limit as string))
                    .map(user => toResponse(user));
                return res.status(HttpCode.OK).json(limitedUsers);
            }

            const users = (await this.userService.getAll()).map(user => toResponse(user));
            return res.status(HttpCode.OK).json(users);
        } catch (error) {
            const typedError = error as Error;
            return winstonLogger.error(`[getAllUsers] args: ${req.query} message: ${typedError.message}`);
        }
    }

    async getOneUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const oneUser = await this.userService.getOne(id);
            return res.status(HttpCode.OK).json(toResponse(oneUser as IUser));
        } catch (error) {
            const typedError = error as Error;
            return winstonLogger.error(`[getOneUser] args: ${req.params} message: ${typedError.message}`);
        }
    }

    async createUser(req: Request, res: Response) {
        try {
            const users = await this.userService.create(req.body);
            return res.status(HttpCode.CREATED).json(toResponse(users as IUser));
        } catch (error) {
            const typedError = error as Error;
            return winstonLogger.error(`[createUser] args: ${req.params} message: ${typedError.message}`);
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updatedUser = await this.userService.update(id, req.body);
            return res.status(HttpCode.OK).json(updatedUser);
        } catch (error) {
            const typedError = error as Error;
            return winstonLogger.error(`[updateUser] args: ${req.params} message: ${typedError.message}`);
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const deletedUser = await this.userService.delete(id);
            return res.status(HttpCode.OK).json(deletedUser);
        } catch (error) {
            const typedError = error as Error;
            return winstonLogger.error(`[deleteUser] args: ${req.params} message: ${typedError.message}`);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        console.log(ENV.SECRET);

        const jwt = await signJWT(req.body.login, req.body.password, ENV.SECRET);
        return res.status(HttpCode.OK).json(jwt);
    }
}
