import { Controller, Get, Post, Put, Del, Param, Body, Inject, Query } from '@midwayjs/core';
import { BlindBoxService } from '../service/blindbox.service';

@Controller('/api/blindboxes')
export class BlindBoxController {
    @Inject()
    blindBoxService: BlindBoxService;

    // 初始化示例数据
    @Post('/init')
    async initData() {
        const sampleData = [
            {
                title: "超可爱的泡泡玛特盲盒开箱！SSR隐藏款到手了！",
                description: "今天终于抽到了心心念念的泡泡玛特系列隐藏款！这个系列的做工真的太精致了，每一个细节都完美还原。开箱的那一刻真的超级激动，没想到真的抽到了SSR！",
                image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=400&fit=crop",
                price: 59,
                likes: 128,
                category: "潮玩",
                series: "泡泡玛特",
                tags: ["潮玩", "手办", "收藏"],
                comments: [],
                items: [
                    { name: "泡泡玛特系列隐藏款", probability: 0.001 },
                    { name: "POP MART 系列普通款", probability: 0.999 }
                ],
                userId: 1
            },
            {
                title: "52TOYS猛兽匣系列开箱，这个做工绝了！",
                description: "52TOYS的猛兽匣系列真的是国货之光！每一个细节都处理得非常好，关节可动性也很棒。这次抽到了SR级别的，虽然不是SSR但也很满意了！",
                image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop",
                price: 89,
                likes: 95,
                category: "机甲",
                series: "52TOYS猛兽匣",
                tags: ["机甲", "变形", "国货"],
                comments: [],
                items: [
                    { name: "52TOYS猛兽匣系列SR", probability: 0.01 },
                    { name: "52TOYS猛兽匣系列R", probability: 0.99 }
                ],
                userId: 1
            },
            {
                title: "万代高达模型盲盒，拼装体验超棒！",
                description: "万代的高达模型盲盒系列，虽然是R级别但拼装体验真的很棒！细节刻画很到位，适合新手入门。推荐给喜欢拼装的朋友们！",
                image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=400&fit=crop",
                price: 129,
                likes: 67,
                category: "拼装",
                series: "万代高达",
                tags: ["拼装", "高达", "模型"],
                comments: [],
                items: [
                    { name: "万代高达模型盲盒R", probability: 0.9 },
                    { name: "万代高达模型盲盒SR", probability: 0.1 }
                ],
                userId: 1
            },
            {
                title: "乐高星球大战盲盒，收藏价值超高！",
                description: "乐高的星球大战系列盲盒，这次抽到了千年隼号！虽然是R级别但收藏价值很高，细节还原度也很棒。乐高粉必入！",
                image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500&h=400&fit=crop",
                price: 199,
                likes: 156,
                category: "积木",
                series: "乐高星球大战",
                tags: ["积木", "乐高", "星球大战"],
                comments: [],
                items: [
                    { name: "乐高星球大战盲盒R", probability: 0.9 },
                    { name: "乐高星球大战盲盒SR", probability: 0.1 }
                ],
                userId: 1
            },
            {
                title: "万代奥特曼系列，童年回忆杀！",
                description: "万代的奥特曼系列盲盒，这次抽到了迪迦奥特曼！做工很精致，关节可动性也不错。满满的童年回忆，奥特曼粉必收！",
                image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop",
                price: 79,
                likes: 203,
                category: "特摄",
                series: "万代奥特曼",
                tags: ["特摄", "奥特曼", "童年"],
                comments: [],
                items: [
                    { name: "万代奥特曼系列SR", probability: 0.1 },
                    { name: "万代奥特曼系列R", probability: 0.9 }
                ],
                userId: 1
            },
            {
                title: "泡泡玛特SKULLPANDA系列，艺术感十足！",
                description: "泡泡玛特的SKULLPANDA系列，这次抽到了艺术家款！设计很有艺术感，配色也很高级。这个系列真的很适合收藏！",
                image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=400&fit=crop",
                price: 69,
                likes: 89,
                category: "潮玩",
                series: "泡泡玛特SKULLPANDA",
                tags: ["潮玩", "艺术", "收藏"],
                comments: [],
                items: [
                    { name: "泡泡玛特SKULLPANDA系列SSR", probability: 0.005 },
                    { name: "泡泡玛特SKULLPANDA系列SR", probability: 0.095 },
                    { name: "泡泡玛特SKULLPANDA系列R", probability: 0.9 }
                ],
                userId: 1
            }
        ];

        const results = [];
        for (const data of sampleData) {
            try {
                const result = await this.blindBoxService.createBlindBox(data);
                results.push(result);
            } catch (error) {
                console.error('创建盲盒失败:', error);
            }
        }

        return {
            success: true,
            message: `成功创建 ${results.length} 个盲盒`,
            data: results
        };
    }

    // 修复现有盲盒数据的 userId 字段
    @Post('/fix-user-id')
    async fixUserId() {
        try {
            // 获取所有没有 userId 的盲盒
            const blindBoxes = await this.blindBoxService.blindBoxModel.find({
                where: { userId: null }
            });

            // 为每个盲盒设置默认的 userId (假设用户ID为1)
            for (const blindBox of blindBoxes) {
                blindBox.userId = 1;
                await this.blindBoxService.blindBoxModel.save(blindBox);
            }

            return {
                success: true,
                message: `修复了 ${blindBoxes.length} 个盲盒的 userId 字段`
            };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // 获取全部盲盒（支持分页）
    @Get('/')
    async getAll(@Query('page') page: number = 1, @Query('limit') limit: number = 12) {
        try {
            const result = await this.blindBoxService.getAllBlindBoxes(page, limit);
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

    // 获取单个盲盒
    @Get('/:id')
    async getOne(@Param('id') id: number) {
        const box = await this.blindBoxService.blindBoxModel.findOne({ where: { id } });
        if (!box) {
            return { success: false, message: '盲盒不存在' };
        }

        // 添加用户信息
        const boxWithUser = {
            ...box,
            user: {
                name: "盲盒爱好者",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
            },
            likedUsers: box.likedUsers || []
        };

        return { success: true, data: boxWithUser };
    }

    // 创建盲盒
    @Post('/')
    async create(@Body() data: any) {
        return await this.blindBoxService.createBlindBox(data);
    }

    // 更新盲盒
    @Put('/:id')
    async update(@Param('id') id: number, @Body() data: any) {
        return await this.blindBoxService.updateBlindBox(id, data);
    }

    // 删除盲盒
    @Del('/:id')
    async delete(@Param('id') id: number) {
        await this.blindBoxService.blindBoxModel.delete(id);
        return { success: true };
    }

    // 点赞
    @Post('/:id/like')
    async like(@Param('id') id: number, @Body() data: any) {
        try {
            const result = await this.blindBoxService.likeBlindBox(id, data.userId);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // 取消点赞
    @Del('/:id/unlike')
    async unlike(@Param('id') id: number, @Body() data: any) {
        try {
            const result = await this.blindBoxService.unlikeBlindBox(id, data.userId);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // 添加评论
    @Post('/:id/comments')
    async addComment(@Param('id') id: number, @Body() comment: any) {
        try {
            const result = await this.blindBoxService.addComment(id, comment);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // 获取评论列表
    @Get('/:id/comments')
    async getComments(@Param('id') id: number) {
        const box = await this.blindBoxService.blindBoxModel.findOne({ where: { id } });
        return (box as any)?.comments || [];
    }

    // 可选：根据title或tag查找盲盒
    @Get('/search')
    async search(@Query('q') q: string) {
        return await this.blindBoxService.searchBlindBoxes(q);
    }

    // 获取用户的盲盒列表
    @Get('/user/:userId')
    async getUserBlindBoxes(@Param('userId') userId: number) {
        try {
            const blindBoxes = await this.blindBoxService.getUserBlindBoxes(userId);
            return { success: true, data: blindBoxes };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // 获取用户盲盒统计
    @Get('/user/:userId/stats')
    async getUserBlindBoxStats(@Param('userId') userId: number) {
        try {
            const stats = await this.blindBoxService.getBlindBoxStats(userId);
            return { success: true, data: stats };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}
