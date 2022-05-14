import * as Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { GroupService } from '../services/group.service';
import { HttpCode } from '../constants/http-code';
import { createValidator, ExpressJoiInstance } from 'express-joi-validation';
import { IGroupController } from './group.controller.interface';
import { BaseController } from '../common/base.controller';
import { winstonLogger } from '../util/logger';
import { AuthGuard } from '../middlewares/auth-guard';

const querySchema = Joi.object({
    name: Joi.string().required(),
    permissions: Joi.array().required()
});

export class GroupController extends BaseController implements IGroupController {
    groupService: GroupService;
    validator: ExpressJoiInstance;

    constructor(groupService: GroupService) {
        super();
        this.groupService = groupService;
        this.validator = createValidator();

        this.bindRoutes([
            {
                path: '/',
                method: 'get',
                func: this.getAllGroups,
                middlewares: [new AuthGuard().execute]
            },
            {
                path: '/:id',
                method: 'get',
                func: this.getOneGroup,
                middlewares: [new AuthGuard().execute]
            },
            {
                path: '/',
                method: 'post',
                func: this.createGroup,
                middlewares: [new AuthGuard().execute, this.validator.body(querySchema)]
            },
            {
                path: '/:id',
                method: 'put',
                func: this.updateGroup,
                middlewares: [new AuthGuard().execute, this.validator.body(querySchema)]
            },
            {
                path: '/:id',
                method: 'delete',
                func: this.deleteGroup,
                middlewares: [new AuthGuard().execute]
            },
            {
                path: '/addUsersToGroup',
                method: 'post',
                func: this.addUsersToGroup,
                middlewares: [new AuthGuard().execute]
            }
        ]);
    }

    async getAllGroups(req: Request, res: Response) {
        try {
            const groups = await this.groupService.getAll();
            return res.status(HttpCode.OK).json(groups);
        } catch (error) {
            const typedError = error as Error;
            return winstonLogger.error(`[getAllGroups] args: ${req.params} message: ${typedError.message}`);
        }
    }

    async getOneGroup(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const oneGroup = await this.groupService.getOne(id);
            return res.status(HttpCode.OK).json(oneGroup);
        } catch (error) {
            const typedError = error as Error;
            return winstonLogger.error(`[getOneGroup] args: ${req.params} message: ${typedError.message}`);
        }
    }

    async createGroup(req: Request, res: Response) {
        try {
            const group = await this.groupService.create(req.body);
            return res.status(HttpCode.CREATED).json(group);
        } catch (error) {
            const typedError = error as Error;
            return winstonLogger.error(`[createGroup] args: ${req.params} message: ${typedError.message}`);
        }
    }

    async updateGroup(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const updatedGroup = await this.groupService.update(id, req.body);
            return res.status(HttpCode.OK).json(updatedGroup);
        } catch (error) {
            const typedError = error as Error;
            return winstonLogger.error(`[updateGroup] args: ${req.params} message: ${typedError.message}`);
        }
    }

    async deleteGroup(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const deletedGroup = await this.groupService.delete(id);
            return res.status(HttpCode.OK).json(deletedGroup);
        } catch (error) {
            const typedError = error as Error;
            return winstonLogger.error(`[deleteGroup] args: ${req.params} message: ${typedError.message}`);
        }
    }

    async addUsersToGroup(req: Request, res: Response) {
        try {
            const { groupId, userIds } = req.body;
            const group = await this.groupService.addUsersToGroup(groupId, userIds);
            return res.status(HttpCode.CREATED).json(group);
        } catch (error) {
            const typedError = error as Error;
            return winstonLogger.error(`[addUsersToGroup] args: ${req.params} message: ${typedError.message}`);
        }
    }
}
