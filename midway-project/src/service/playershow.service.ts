import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerShow } from '../entity/playershow.entity';
import { Order } from '../entity/order.entity';

@Provide()
export class PlayerShowService {
    @InjectEntityModel(PlayerShow)
    playerShowModel: Repository<PlayerShow>;

    @InjectEntityModel(Order)
    orderModel: Repository<Order>;

    // 创建玩家秀
    async createPlayerShow(data: Partial<PlayerShow>) {
        // 检查用户是否购买过该盲盒
        const order = await this.orderModel.findOne({
            where: { userId: data.userId, blindBoxId: data.blindBoxId }
        });

        if (!order) {
            throw new Error('您必须先购买该盲盒才能发表玩家秀');
        }

        const playerShow = this.playerShowModel.create(data);
        return await this.playerShowModel.save(playerShow);
    }

    // 获取所有玩家秀（支持分页）
    async getAllPlayerShows(page: number = 1, limit: number = 12) {
        const skip = (page - 1) * limit;
        
        const [playerShows, total] = await this.playerShowModel.findAndCount({
            skip,
            take: limit,
            order: { createTime: 'DESC' }
        });

        return {
            data: playerShows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: page * limit < total
            }
        };
    }

    // 获取单个玩家秀
    async getPlayerShow(id: number) {
        return await this.playerShowModel.findOne({ where: { id } });
    }

    // 获取用户的玩家秀
    async getUserPlayerShows(userId: number) {
        return await this.playerShowModel.find({
            where: { userId },
            order: { createTime: 'DESC' }
        });
    }

    // 获取盲盒的玩家秀
    async getBlindBoxPlayerShows(blindBoxId: number) {
        return await this.playerShowModel.find({
            where: { blindBoxId },
            order: { createTime: 'DESC' }
        });
    }

    // 更新玩家秀
    async updatePlayerShow(id: number, data: Partial<PlayerShow>) {
        const playerShow = await this.playerShowModel.findOne({ where: { id } });
        if (!playerShow) {
            throw new Error('玩家秀不存在');
        }

        Object.assign(playerShow, data);
        playerShow.updateTime = new Date();
        return await this.playerShowModel.save(playerShow);
    }

    // 删除玩家秀
    async deletePlayerShow(id: number, userId: number) {
        const playerShow = await this.playerShowModel.findOne({ where: { id } });
        if (!playerShow) {
            throw new Error('玩家秀不存在');
        }

        if (playerShow.userId !== userId) {
            throw new Error('只能删除自己的玩家秀');
        }

        await this.playerShowModel.delete(id);
        return { success: true };
    }

    // 点赞玩家秀
    async likePlayerShow(id: number, userId: number) {
        const playerShow = await this.playerShowModel.findOne({ where: { id } });
        if (!playerShow) {
            throw new Error('玩家秀不存在');
        }

        const likedUsers = playerShow.likedUsers || [];
        if (!likedUsers.includes(userId)) {
            likedUsers.push(userId);
            playerShow.likedUsers = likedUsers;
            playerShow.likes = likedUsers.length;
            return await this.playerShowModel.save(playerShow);
        } else {
            throw new Error('您已经点赞过了');
        }
    }

    // 取消点赞
    async unlikePlayerShow(id: number, userId: number) {
        const playerShow = await this.playerShowModel.findOne({ where: { id } });
        if (!playerShow) {
            throw new Error('玩家秀不存在');
        }

        const likedUsers = playerShow.likedUsers || [];
        const index = likedUsers.indexOf(userId);
        if (index > -1) {
            likedUsers.splice(index, 1);
            playerShow.likedUsers = likedUsers;
            playerShow.likes = likedUsers.length;
            return await this.playerShowModel.save(playerShow);
        } else {
            throw new Error('您还没有点赞');
        }
    }

    // 添加评论
    async addComment(id: number, comment: { userId: number; content: string }) {
        const playerShow = await this.playerShowModel.findOne({ where: { id } });
        if (!playerShow) {
            throw new Error('玩家秀不存在');
        }

        const comments = playerShow.comments || [];
        comments.push({
            ...comment,
            time: new Date()
        });
        playerShow.comments = comments;
        return await this.playerShowModel.save(playerShow);
    }

    // 初始化示例数据
    async initSampleData() {
        const sampleData = [
            {
                userId: 1,
                blindBoxId: 1,
                title: "泡泡玛特隐藏款开箱！太幸运了！",
                content: "今天终于抽到了心心念念的泡泡玛特系列隐藏款！这个系列的做工真的太精致了，每一个细节都完美还原。开箱的那一刻真的超级激动，没想到真的抽到了SSR！",
                images: ["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=400&fit=crop"],
                likes: 15,
                likedUsers: [2, 3, 4],
                comments: [
                    { userId: 2, content: "太幸运了！我也想要这个隐藏款", time: new Date() },
                    { userId: 3, content: "恭喜恭喜！", time: new Date() }
                ]
            },
            {
                userId: 1,
                blindBoxId: 2,
                title: "52TOYS猛兽匣SR开箱",
                content: "52TOYS的猛兽匣系列真的是国货之光！每一个细节都处理得非常好，关节可动性也很棒。这次抽到了SR级别的，虽然不是SSR但也很满意了！",
                images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop"],
                likes: 8,
                likedUsers: [2],
                comments: [
                    { userId: 2, content: "52TOYS确实不错，支持国货！", time: new Date() }
                ]
            },
            {
                userId: 1,
                blindBoxId: 3,
                title: "万代高达模型拼装体验",
                content: "万代的高达模型盲盒系列，虽然是R级别但拼装体验真的很棒！细节刻画很到位，适合新手入门。推荐给喜欢拼装的朋友们！",
                images: ["https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=400&fit=crop"],
                likes: 12,
                likedUsers: [2, 3],
                comments: [
                    { userId: 2, content: "新手适合吗？想入坑", time: new Date() },
                    { userId: 3, content: "高达粉必入！", time: new Date() }
                ]
            }
        ];

        const results = [];
        for (const data of sampleData) {
            try {
                const result = await this.createPlayerShow(data);
                results.push(result);
            } catch (error) {
                console.error('创建玩家秀失败:', error);
            }
        }

        return {
            success: true,
            message: `成功创建 ${results.length} 个玩家秀`,
            data: results
        };
    }
} 