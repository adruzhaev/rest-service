import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user.model';

export type Permission = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES';

@Entity('groups')
export class Group {
    @PrimaryGeneratedColumn()
        id: string;

    @Column()
        name: string;

    @Column('text', { array: true })
        permissions: Permission[];

    @ManyToMany(() => User, {
        cascade: true
    })
    @JoinTable({ name: 'user_group' })
        users: User[];
}
