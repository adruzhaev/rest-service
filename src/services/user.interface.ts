export interface IUser {
    id: string
    login: string;
    password: string;
    age: number;
    deletedAt?: Date | null;
}
