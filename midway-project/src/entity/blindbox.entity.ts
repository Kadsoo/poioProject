import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity('blindbox')
export class BlindBox {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    // 图片地址
    @Column()
    image: string;

    // 价格
    @Column()
    price: number;

    // 用户ID
    @Column()
    userId: number;

    // 类别
    @Column({ nullable: true })
    category: string;

    // 系列
    @Column({ nullable: true })
    series: string;

    // 标签
    @Column('simple-json', { nullable: true })
    tags: string[];

    // 评论
    @Column('simple-json', { nullable: true })
    comments: { userId: number; content: string; time: Date }[];

    // 点赞数
    @Column({ default: 0 })
    likes: number;

    // 点赞用户列表
    @Column('simple-json', { nullable: true })
    likedUsers: number[];

    // 发布时间
    @CreateDateColumn()
    posttime: Date;

    // 盲盒包含的物品及概率
    // 例如: [{ name: '小熊', probability: 0.5 }, { name: '小猫', probability: 0.3 }, { name: '隐藏款', probability: 0.2 }]
    @Column('simple-json', { nullable: true })
    items: { name: string; probability: number }[];
}