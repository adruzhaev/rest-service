import * as Joi from 'joi';
import { Request, Response } from 'express';
import { GroupService } from '../services/group.service';
import { HttpCode } from '../util/const';
import { createValidator, ExpressJoiInstance } from 'express-joi-validation';
import { IGroupController } from './group.controller.interface';
import { BaseController } from '../common/base.controller';

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
                func: this.getAllGroups
            },
            {
                path: '/:id',
                method: 'get',
                func: this.getOneGroup
            },
            {
                path: '/',
                method: 'post',
                func: this.createGroup,
                middlewares: [this.validator.body(querySchema)]
            },
            {
                path: '/:id',
                method: 'put',
                func: this.updateGroup,
                middlewares: [this.validator.body(querySchema)]
            },
            {
                path: '/:id',
                method: 'delete',
                func: this.deleteGroup
            },
            {
                path: '/addUsersToGroup',
                method: 'post',
                func: this.addUsersToGroup
            }
        ]);
    }

    async getAllGroups(req: Request, res: Response) {
        const groups = (await this.groupService.getAll()).map(group => group);
        return res.status(HttpCode.OK).json(groups);
    }

    async getOneGroup(req: Request, res: Response) {
        const { id } = req.params;
        const oneGroup = await this.groupService.getOne(id);
        return res.status(HttpCode.OK).json(oneGroup);
    }

    async createGroup(req: Request, res: Response) {
        const group = await this.groupService.create(req.body);
        return res.status(HttpCode.CREATED).json(group);
    }

    async updateGroup(req: Request, res: Response) {
        const { id } = req.params;
        const existedGroup = await this.groupService.getOne(id);

        if (!existedGroup) {
            return res.status(HttpCode.NOT_FOUND).send('Group is not found');
        }

        const updatedGroup = await this.groupService.update(id, req.body);
        return res.status(HttpCode.OK).json(updatedGroup);
    }

    async deleteGroup(req: Request, res: Response) {
        const { id } = req.params;
        const deletedGroup = await this.groupService.delete(id);

        if (!deletedGroup) {
            return res.status(HttpCode.NOT_FOUND).send('Group is not found');
        }

        return res.status(HttpCode.OK).json(deletedGroup);
    }

    async addUsersToGroup(req: Request, res: Response) {
        const { groupId, userIds } = req.body;

        const group = await this.groupService.addUsersToGroup(groupId, userIds);
        return res.status(HttpCode.CREATED).json(group);
    }
}
