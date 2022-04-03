import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export type Permission = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES';

@Entity('groups')
export class Group {
    @PrimaryGeneratedColumn()
        id: string;

    @Column()
        name: string;

    @Column('text', { array: true })
        permissions: Permission[];
}
