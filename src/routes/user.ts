import { Router, Request, Response } from 'express';
import { UserService } from '../services/user.sevice';
import { HttpCode } from '../util/const';

export const user = (app: Router, service: UserService) => {
    const router = Router();
    app.use('/users', router);

    router.get('/', (req: Request, res: Response) => {
        const users = service.getAll();
        return res.status(HttpCode.OK).json(users);
    });

    router.get('/:id', (req: Request, res: Response) => {
        const { id } = req.params;
        const oneUser = service.getOne(id);
        return res.status(HttpCode.OK).json(oneUser);
    });

    router.post('/', (req: Request, res: Response) => {
        const users = service.create(req.body);
        console.log(users);
        return res.status(HttpCode.CREATED).json(users);
    });

    router.put('/:id', (req: Request, res: Response) => {
        const { id } = req.params;
        const existedUser = service.getOne(id);

        if (!existedUser) {
            return res.status(HttpCode.NOT_FOUND).send('User is not found');
        }

        const updatedUser = service.update(id, req.body);

        return res.status(HttpCode.OK).json(updatedUser);
    });

    router.delete('/:id', (req: Request, res: Response) => {
        const { id } = req.params;
        const deletedUser = service.delete(id);

        if (!deletedUser) {
            return res.status(HttpCode.NOT_FOUND).send('User is not found');
        }

        return res.status(HttpCode.OK).json(deletedUser);
    });
};
