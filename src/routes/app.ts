import { Router } from 'express';
import { UserService } from '../services/user.sevice';
import { user } from './user';

const routes = Router();

(() => {
    user(routes, new UserService([]));
})();

export { routes };
