import { Permission } from '../models/group.model';

export interface IGroup {
    id: string
    name: string;
    permissions: Permission[];
}
