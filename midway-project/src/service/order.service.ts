import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entity/order.entity';

@Provide()
export class OrderService {
    @InjectEntityModel(Order) orderModel: Repository<Order>;

    // 创建订单
    async createOrder(data: Partial<Order>) {
        const order = this.orderModel.create(data);
        return await this.orderModel.save(order);
    }

    // 获取用户订单列表
    async getUserOrders(userId: number) {
        return await this.orderModel.find({
            where: { userId },
            order: { createTime: 'DESC' }
        });
    }

    // 获取订单详情
    async getOrder(id: number) {
        return await this.orderModel.findOne({ where: { id } });
    }

    // 更新订单状态
    async updateOrderStatus(id: number, status: string, additionalData?: any) {
        const order = await this.orderModel.findOne({ where: { id } });
        if (!order) {
            throw new Error('订单不存在');
        }

        order.status = status;

        // 根据状态更新时间字段
        const now = new Date();
        switch (status) {
            case 'paid':
                order.payTime = now;
                break;
            case 'shipped':
                order.shipTime = now;
                break;
            case 'delivered':
                order.deliverTime = now;
                break;
            case 'cancelled':
                order.cancelTime = now;
                if (additionalData?.cancelReason) {
                    order.cancelReason = additionalData.cancelReason;
                }
                break;
        }

        return await this.orderModel.save(order);
    }

    // 删除订单
    async deleteOrder(id: number) {
        const order = await this.orderModel.findOne({ where: { id } });
        if (!order) {
            throw new Error('订单不存在');
        }
        return await this.orderModel.remove(order);
    }

    // 获取用户订单统计
    async getUserOrderStats(userId: number) {
        const orders = await this.orderModel.find({ where: { userId } });

        const stats = {
            total: orders.length,
            pending: orders.filter(o => o.status === 'pending').length,
            paid: orders.filter(o => o.status === 'paid').length,
            shipped: orders.filter(o => o.status === 'shipped').length,
            delivered: orders.filter(o => o.status === 'delivered').length,
            cancelled: orders.filter(o => o.status === 'cancelled').length,
            totalAmount: orders.reduce((sum, o) => sum + o.totalPrice, 0)
        };

        return stats;
    }
} 