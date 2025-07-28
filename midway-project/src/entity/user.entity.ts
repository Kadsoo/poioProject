import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity('user')
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    mail: string;

    @Column()
    phone: string;

    @Column({ nullable: true })
    avatar: string;

    @CreateDateColumn()
    registerDate: Date;
}