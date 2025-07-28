import { Controller, Get, Post, Put, Del, Param, Body, Query, Inject } from '@midwayjs/core';
import { OrderService } from '../service/order.service';

@Controller('/api/orders')
export class OrderController {
    @Inject()
    orderService: OrderService;

    // 购买盲盒
    @Post('/purchase')
    async purchaseBlindBox(@Body() data: any) {
        try {
            const { userId, blindBoxId, quantity = 1, shippingInfo } = data;

            if (!userId || !blindBoxId) {
                return { success: false, message: '用户ID和盲盒ID不能为空' };
            }

            const result = await this.orderService.createOrder(userId, blindBoxId, quantity, shippingInfo);
            return result;
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // 获取用户订单统计
    @Get('/user/:userId/stats')
    async getUserOrderStats(@Param('userId') userId: number) {
        try {
            const stats = await this.orderService.getUserOrderStats(userId);
            return { success: true, data: stats };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // 获取用户订单列表
    @Get('/user/:userId')
    async getUserOrders(@Param('userId') userId: number) {
        try {
            const orders = await this.orderService.getUserOrders(userId);
            return { success: true, data: orders };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // 更新订单状态
    @Put('/:id/status')
    async updateOrderStatus(@Param('id') id: number, @Body() data: any) {
        try {
            const { status } = data;
            const order = await this.orderService.updateOrderStatus(id, status);
            return { success: true, data: order };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // 获取订单详情
    @Get('/:id')
    async getOrder(@Param('id') id: number) {
        try {
            const order = await this.orderService.getOrder(id);
            if (!order) {
                return { success: false, message: '订单不存在' };
            }
            return { success: true, data: order };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // 删除订单
    @Del('/:id')
    async deleteOrder(@Param('id') id: number) {
        try {
            await this.orderService.deleteOrder(id);
            return { success: true, message: '订单删除成功' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // 获取盲盒的购买记录
    @Get('/blindbox/:blindBoxId')
    async getBlindBoxOrders(@Param('blindBoxId') blindBoxId: number) {
        try {
            const orders = await this.orderService.getBlindBoxOrders(blindBoxId);
            return { success: true, data: orders };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // 获取盲盒所有者的购买记录（需要验证权限）
    @Get('/blindbox/:blindBoxId/owner')
    async getBlindBoxOwnerOrders(@Param('blindBoxId') blindBoxId: number, @Query('userId') userId: number) {
        try {
            const result = await this.orderService.getBlindBoxOwnerOrders(blindBoxId);

            // 验证是否是盲盒所有者
            if (result.blindBox.userId !== userId) {
                return { success: false, message: '无权限查看此盲盒的购买记录' };
            }

            return { success: true, data: result };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
} 