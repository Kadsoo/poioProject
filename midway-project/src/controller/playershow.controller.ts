import { Controller, Get, Post, Put, Del, Param, Body, Inject, Query } from '@midwayjs/core';
import { PlayerShowService } from '../service/playershow.service';

@Controller('/api/playershows')
export class PlayerShowController {
    @Inject()
    playerShowService: PlayerShowService;

    // 初始化示例数据
    @Post('/init')
    async initData() {
        return await this.playerShowService.initSampleData();
    }

    // 获取所有玩家秀（支持分页）
    @Get('/')
    async getAll(@Query('page') page: number = 1, @Query('limit') limit: number = 12) {
        try {
            const result = await this.playerShowService.getAllPlayerShows(page, limit);
            return {
                success: true,
                ...result
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    // 获取单个玩家秀
    @Get('/:id')
    async getOne(@Param('id') id: number) {
        try {
            const playerShow = await this.playerShowService.getPlayerShow(id);
            if (!playerShow) {
                return { success: false, message: '玩家秀不存在' };
            }
            return { success: true, data: playerShow };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // 创建玩家秀
    @Post('/')
    async create(@Body() data: any) {
        try {
            const result = await this.playerShowService.createPlayerShow(data);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // 更新玩家秀
    @Put('/:id')
    async update(@Param('id') id: number, @Body() data: any) {
        try {
            const result = await this.playerShowService.updatePlayerShow(id, data);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // 删除玩家秀
    @Del('/:id')
    async delete(@Param('id') id: number, @Body() data: any) {
        try {
            const result = await this.playerShowService.deletePlayerShow(id, data.userId);
            return result;
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // 点赞玩家秀
    @Post('/:id/like')
    async like(@Param('id') id: number, @Body() data: any) {
        try {
            const result = await this.playerShowService.likePlayerShow(id, data.userId);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // 取消点赞
    @Del('/:id/unlike')
    async unlike(@Param('id') id: number, @Body() data: any) {
        try {
            const result = await this.playerShowService.unlikePlayerShow(id, data.userId);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // 添加评论
    @Post('/:id/comments')
    async addComment(@Param('id') id: number, @Body() comment: any) {
        try {
            const result = await this.playerShowService.addComment(id, comment);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // 获取用户的玩家秀
    @Get('/user/:userId')
    async getUserPlayerShows(@Param('userId') userId: number) {
        try {
            const playerShows = await this.playerShowService.getUserPlayerShows(userId);
            return { success: true, data: playerShows };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // 获取盲盒的玩家秀
    @Get('/blindbox/:blindBoxId')
    async getBlindBoxPlayerShows(@Param('blindBoxId') blindBoxId: number) {
        try {
            const playerShows = await this.playerShowService.getBlindBoxPlayerShows(blindBoxId);
            return { success: true, data: playerShows };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
} 