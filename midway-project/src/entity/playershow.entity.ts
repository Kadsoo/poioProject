import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('playershow')
export class PlayerShow {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

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