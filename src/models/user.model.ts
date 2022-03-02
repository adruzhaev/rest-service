import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
        id: string;

    @Column()
        login: string;

    @Column()
        password: string;

    @Column()
        age: number;

    @DeleteDateColumn({ default: null })
        deletedAt: Date;
}
