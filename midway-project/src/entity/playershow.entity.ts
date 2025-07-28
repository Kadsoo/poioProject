import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('playershow')
export class PlayerShow {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    blindBoxId: number;

    @Column()
    title: string;

    @Column('text')
    content: string;

    @Column('simple-json', { nullable: true })
    images: string[];

    @Column('simple-json', { nullable: true })
    comments: { userId: number; content: string; time: Date }[];

    @Column({ default: 0 })
    likes: number;

    @Column('simple-json', { nullable: true })
    likedUsers: number[];

    @CreateDateColumn()
    createTime: Date;

    @Column({ nullable: true })
    updateTime: Date;
} 