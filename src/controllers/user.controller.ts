import * as Joi from 'joi';
import { Request, Response } from 'express';
import { UserService } from '../services/user.sevice';
import { HttpCode } from '../util/const';
import { createValidator, ExpressJoiInstance } from 'express-joi-validation';
import { IUserController } from './user.controller.interface';
import { BaseController } from '../common/base.controller';

const querySchema = Joi.object({
    login: Joi.string().required(),
    password: Joi.string().regex(/^[a-z0-9]+$/).required(),
    age: Joi.number().min(4).max(130).required(),
    isDeleted: Joi.boolean().required()
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

    getAllUsers(req: Request, res: Response) {
        const { login, limit } = req.query;

        if (login && limit) {
            const limitedUsers = this.userService.getAutoSuggestUsers(login as string, limit as string);
            return res.status(HttpCode.OK).json(limitedUsers);
        }

        const users = this.userService.getAll();
        return res.status(HttpCode.OK).json(users);
    }

    getOneUser(req: Request, res: Response) {
        const { id } = req.params;
        const oneUser = this.userService.getOne(id);
        return res.status(HttpCode.OK).json(oneUser);
    }

    createUser(req: Request, res: Response) {
        const users = this.userService.create(req.body);
        return res.status(HttpCode.CREATED).json(users);
    }

    updateUser(req: Request, res: Response) {
        const { id } = req.params;
        const existedUser = this.userService.getOne(id);

        if (!existedUser) {
            return res.status(HttpCode.NOT_FOUND).send('User is not found');
        }

        const updatedUser = this.userService.update(id, req.body);
        return res.status(HttpCode.OK).json(updatedUser);
    }

    deleteUser(req: Request, res: Response) {
        const { id } = req.params;
        const deletedUser = this.userService.delete(id);

        if (!deletedUser) {
            return res.status(HttpCode.NOT_FOUND).send('User is not found');
        }

        return res.status(HttpCode.OK).json(deletedUser);
    }
}
