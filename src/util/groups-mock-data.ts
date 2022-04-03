import { Permission } from '../models/group.model';
export const groupsMockData = [
    {
        'id': '1',
        'name': 'group1',
        'permissions': [
            'READ',
            'WRITE'
        ] as Permission[]
    },
    {
        'id': '2',
        'name': 'group2',
        'permissions': [
            'READ'
        ] as Permission[]
    }
];
