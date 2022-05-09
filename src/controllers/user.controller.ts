import * as Joi from 'joi';
import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { HttpCode } from '../constants/http-code';
import { createValidator, ExpressJoiInstance } from 'express-joi-validation';
import { IUserController } from './user.controller.interface';
import { BaseController } from '../common/base.controller';
import { toResponse } from '../common/user.response';
import { IUser } from '../services/user.interface';

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
                func: this.getAllUsers
            },
            {
                path: '/:id',
                method: 'get',
                func: this.getOneUser
            },
            {
                path: '/',
                method: 'post',
                func: this.createUser,
                middlewares: [this.validator.body(querySchema)]
            },
            {
                path: '/:id',
                method: 'put',
                func: this.updateUser,
                middlewares: [this.validator.body(querySchema)]
            },
            {
                path: '/:id',
                method: 'delete',
                func: this.deleteUser
            }
        ]);
    }

    async getAllUsers(req: Request, res: Response) {
        const { login, limit } = req.query;

        if (limit && login) {
            const limitedUsers = (await this.userService.getAutoSuggestUsers(login as string, limit as string))
                .map(user => toResponse(user));
            return res.status(HttpCode.OK).json(limitedUsers);
        }

        const users = (await this.userService.getAll()).map(user => toResponse(user));
        return res.status(HttpCode.OK).json(users);
    }

    async getOneUser(req: Request, res: Response) {
        const { id } = req.params;
        const oneUser = await this.userService.getOne(id);
        return res.status(HttpCode.OK).json(toResponse(oneUser as IUser));
    }

    async createUser(req: Request, res: Response) {
        const users = await this.userService.create(req.body);
        return res.status(HttpCode.CREATED).json(toResponse(users as IUser));
    }

    async updateUser(req: Request, res: Response) {
        const { id } = req.params;
        const existedUser = await this.userService.getOne(id);

        if (!existedUser) {
            return res.status(HttpCode.NOT_FOUND).send('User is not found');
        }

        const updatedUser = await this.userService.update(id, req.body);
        return res.status(HttpCode.OK).json(updatedUser);
    }

    async deleteUser(req: Request, res: Response) {
        const { id } = req.params;
        const deletedUser = await this.userService.delete(id);

        if (!deletedUser) {
            return res.status(HttpCode.NOT_FOUND).send('User is not found');
        }

        return res.status(HttpCode.OK).json(deletedUser);
    }
}
