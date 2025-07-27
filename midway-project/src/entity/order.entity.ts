import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity('order')
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    // 用户ID
    @Column()
    userId: number;

    // 盲盒ID
    @Column()
    blindBoxId: number;

    // 购买数量
    @Column()
    quantity: number;

    // 总价格
    @Column()
    totalPrice: number;

    // 订单状态
    @Column({ default: 'pending' })
    status: string;

    // 收货地址
    @Column({ nullable: true })
    shippingAddress: string;

    // 联系电话
    @Column({ nullable: true })
    contactPhone: string;

    // 联系人姓名
    @Column({ nullable: true })
    contactName: string;

    // 抽奖结果
    @Column('simple-json', { nullable: true })
    items: { name: string; probability: number }[];

    // 创建时间
    @CreateDateColumn()
    createTime: Date;

    // 支付时间
    @Column({ nullable: true })
    payTime: Date;

    // 发货时间
    @Column({ nullable: true })
    shipTime: Date;

    // 送达时间
    @Column({ nullable: true })
    deliverTime: Date;

    // 取消时间
    @Column({ nullable: true })
    cancelTime: Date;

    // 取消原因
    @Column({ nullable: true })
    cancelReason: string;
} 