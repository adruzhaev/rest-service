import * as Joi from 'joi';
import { Router, Request, Response } from 'express';
import { UserService } from '../services/user.sevice';
import { HttpCode } from '../util/const';
import { createValidator } from 'express-joi-validation';

export const user = (app: Router, service: UserService) => {
    const router = Router();
    app.use('/users', router);
    const validator = createValidator();

    const querySchema = Joi.object({
        login: Joi.string().required(),
        password: Joi.string().regex(/^[a-z0-9]+$/).required(),
        age: Joi.number().min(4).max(130).required(),
        isDeleted: Joi.boolean().required()
    });

    router.get('/', (req: Request, res: Response) => {
        const users = service.getAll();
        return res.status(HttpCode.OK).json(users);
    });

    router.get('/:id', (req: Request, res: Response) => {
        const { id } = req.params;
        const oneUser = service.getOne(id);
        return res.status(HttpCode.OK).json(oneUser);
    });

    router.post('/', validator.body(querySchema), (req: Request, res: Response) => {
        const users = service.create(req.body);
        return res.status(HttpCode.CREATED).json(users);
    });

    router.put('/:id', validator.body(querySchema), (req: Request, res: Response) => {
        const { id } = req.params;
        const existedUser = service.getOne(id);

        if (!existedUser) {
            return res.status(HttpCode.NOT_FOUND).send('User is not found');
        }

        const updatedUser = service.update(id, req.body);

        return res.status(HttpCode.OK).json(updatedUser);
    });

    router.delete('/:id', validator.body(querySchema), (req: Request, res: Response) => {
        const { id } = req.params;
        const deletedUser = service.delete(id);

        if (!deletedUser) {
            return res.status(HttpCode.NOT_FOUND).send('User is not found');
        }

        return res.status(HttpCode.OK).json(deletedUser);
    });
};
