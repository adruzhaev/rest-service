import { v4 as uuidv4 } from 'uuid';
import { IUser } from './user.interface';

export class UserService {
    users: IUser[];

    constructor(users: IUser[]) {
        this.users = users;
    }

    create(user: IUser) {
        const newUser = Object.assign({
            id: uuidv4()
        }, user);

        this.users.push(newUser);
        return newUser;
    }

    getOne(id: string) {
        console.log(this.users.find(user => user.id === id));
        return this.users.find(user => user.id === id);
    }

    getAll() {
        return this.users.filter(user => !user.isDeleted);
    }

    update(id: string, user: IUser) {
        const oldUser = this.users.find(item => item.id === id);
        return Object.assign(oldUser, user);
    }

    delete(id: string) {
        const oldUser = this.users.find(item => item.id === id);
        return Object.assign(oldUser, { isDeleted: true });
    }
}
