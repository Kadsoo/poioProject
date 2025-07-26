import { Controller, Get, Post, Put, Del, Param, Body, Inject } from '@midwayjs/core';
import { OrderService } from '../service/order.service';

@Controller('/api/orders')
export class OrderController {
    @Inject() orderService: OrderService;

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

    // 创建订单
    @Post('/')
    async createOrder(@Body() data: any) {
        try {
            const order = await this.orderService.createOrder(data);
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

    // 更新订单状态
    @Put('/:id/status')
    async updateOrderStatus(@Param('id') id: number, @Body() data: any) {
        try {
            const order = await this.orderService.updateOrderStatus(id, data.status, data);
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
} 