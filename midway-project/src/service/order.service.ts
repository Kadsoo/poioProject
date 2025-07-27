import { Provide, Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entity/order.entity';
import { BlindBoxService } from './blindbox.service';

@Provide()
export class OrderService {
    @InjectEntityModel(Order)
    orderModel: Repository<Order>;

    @Inject()
    blindBoxService: BlindBoxService;

    // 创建订单（购买盲盒）
    async createOrder(userId: number, blindBoxId: number, quantity: number = 1, shippingInfo?: any) {
        try {
            // 购买盲盒并抽奖
            const purchaseResult = await this.blindBoxService.purchaseBlindBox(blindBoxId, userId, quantity);

            // 创建订单
            const order = this.orderModel.create({
                userId,
                blindBoxId,
                quantity,
                totalPrice: purchaseResult.totalPrice,
                items: purchaseResult.items,
                status: 'pending',
                shippingAddress: shippingInfo?.address,
                contactPhone: shippingInfo?.phone,
                contactName: shippingInfo?.name
            });

            const savedOrder = await this.orderModel.save(order);

            return {
                success: true,
                data: {
                    order: savedOrder,
                    items: purchaseResult.items
                }
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
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
    async updateOrderStatus(id: number, status: string) {
        const order = await this.orderModel.findOne({ where: { id } });
        if (!order) {
            throw new Error('订单不存在');
        }

        order.status = status;

        // 根据状态更新时间
        switch (status) {
            case 'paid':
                order.payTime = new Date();
                break;
            case 'shipped':
                order.shipTime = new Date();
                break;
            case 'delivered':
                order.deliverTime = new Date();
                break;
            case 'cancelled':
                order.cancelTime = new Date();
                break;
        }

        return await this.orderModel.save(order);
    }

    // 删除订单
    async deleteOrder(id: number) {
        await this.orderModel.delete(id);
        return { success: true };
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
            totalAmount: orders.reduce((sum, order) => sum + order.totalPrice, 0)
        };

        return stats;
    }
} 