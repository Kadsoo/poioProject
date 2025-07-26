import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity('order')
export class Order {
    @PrimaryGeneratedColumn() id: number;

    @Column() userId: number; // 用户ID

    @Column() blindBoxId: number; // 盲盒ID

    @Column() quantity: number; // 购买数量

    @Column() totalPrice: number; // 总价格

    @Column({ default: 'pending' }) status: string; // 订单状态: pending, paid, shipped, delivered, cancelled

    @Column({ nullable: true }) shippingAddress: string; // 收货地址

    @Column({ nullable: true }) contactPhone: string; // 联系电话

    @Column({ nullable: true }) contactName: string; // 联系人姓名

    @CreateDateColumn() createTime: Date; // 创建时间

    @Column({ nullable: true }) payTime: Date; // 支付时间

    @Column({ nullable: true }) shipTime: Date; // 发货时间

    @Column({ nullable: true }) deliverTime: Date; // 送达时间

    @Column({ nullable: true }) cancelTime: Date; // 取消时间

    @Column({ nullable: true }) cancelReason: string; // 取消原因
} 