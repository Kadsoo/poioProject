import { Provide, Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { BlindBox } from '../entity/blindbox.entity';

@Provide()
export class BlindBoxService {
    @InjectEntityModel(BlindBox)
    blindBoxModel: Repository<BlindBox>;

    // 创建盲盒
    async createBlindBox(data: Partial<BlindBox>) {
        const blindBox = this.blindBoxModel.create(data);
        return await this.blindBoxModel.save(blindBox);
    }

    // 修改盲盒
    async updateBlindBox(id: number, data: Partial<BlindBox>) {
        await this.blindBoxModel.update(id, data);
        return await this.blindBoxModel.findOne({ where: { id } });
    }

    // 展示全部盲盒（支持分页）
    async getAllBlindBoxes(page: number = 1, limit: number = 12) {
        const skip = (page - 1) * limit;

        const [blindBoxes, total] = await this.blindBoxModel.findAndCount({
            skip,
            take: limit,
            order: { posttime: 'DESC' }
        });

        // 为每个盲盒添加用户信息
        const blindBoxesWithUser = blindBoxes.map(box => ({
            ...box,
            user: {
                name: "盲盒爱好者",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
            },
            likedUsers: box.likedUsers || []
        }));

        return {
            data: blindBoxesWithUser,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: page * limit < total
            }
        };
    }

    // 根据title或tag查找盲盒
    async searchBlindBoxes(keyword: string) {
        // tag 作为 items.name 匹配
        return await this.blindBoxModel.createQueryBuilder('blindbox')
            .where('blindbox.title LIKE :kw', { kw: `%${keyword}%` })
            .orWhere(`json_extract(blindbox.items, '$[*].name') LIKE :kw`, { kw: `%${keyword}%` })
            .getMany();
    }

    // 点赞
    async likeBlindBox(id: number, userId: number) {
        const box = await this.blindBoxModel.findOne({ where: { id } });
        if (!box) throw new Error('盲盒不存在');

        const likedUsers = box.likedUsers || [];
        if (!likedUsers.includes(userId)) {
            likedUsers.push(userId);
            box.likedUsers = likedUsers;
            box.likes = likedUsers.length;
            const savedBox = await this.blindBoxModel.save(box);

            // 返回带用户信息的盲盒数据
            return {
                ...savedBox,
                user: {
                    name: "盲盒爱好者",
                    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
                },
                likedUsers: savedBox.likedUsers || []
            };
        } else {
            throw new Error('您已经点赞过了');
        }
    }

    // 取消点赞
    async unlikeBlindBox(id: number, userId: number) {
        const box = await this.blindBoxModel.findOne({ where: { id } });
        if (!box) throw new Error('盲盒不存在');

        const likedUsers = box.likedUsers || [];
        const index = likedUsers.indexOf(userId);
        if (index > -1) {
            likedUsers.splice(index, 1);
            box.likedUsers = likedUsers;
            box.likes = likedUsers.length;
            const savedBox = await this.blindBoxModel.save(box);

            // 返回带用户信息的盲盒数据
            return {
                ...savedBox,
                user: {
                    name: "盲盒爱好者",
                    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
                },
                likedUsers: savedBox.likedUsers || []
            };
        } else {
            throw new Error('您还没有点赞');
        }
    }

    // 添加评论
    async addComment(id: number, comment: { userId: number; content: string; time?: Date }) {
        const box = await this.blindBoxModel.findOne({ where: { id } });
        if (!box) throw new Error('盲盒不存在');

        let comments = box.comments || [];
        comments.push({
            userId: comment.userId,
            content: comment.content,
            time: comment.time || new Date()
        });
        box.comments = comments;
        const savedBox = await this.blindBoxModel.save(box);

        // 返回带用户信息的盲盒数据
        return {
            ...savedBox,
            user: {
                name: "盲盒爱好者",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
            },
            likedUsers: savedBox.likedUsers || []
        };
    }

    // 获取用户的盲盒列表
    async getUserBlindBoxes(userId: number) {
        const blindBoxes = await this.blindBoxModel.find({
            where: { userId },
            order: { posttime: 'DESC' }
        });

        // 为每个盲盒添加用户信息
        return blindBoxes.map(box => ({
            ...box,
            user: {
                name: "盲盒爱好者",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
            },
            likedUsers: box.likedUsers || []
        }));
    }

    // 获取盲盒统计信息
    async getBlindBoxStats(userId: number) {
        const blindBoxes = await this.blindBoxModel.find({ where: { userId } });

        const stats = {
            total: blindBoxes.length,
            totalLikes: blindBoxes.reduce((sum, box) => sum + (box.likes || 0), 0),
            totalComments: blindBoxes.reduce((sum, box) => sum + (box.comments?.length || 0), 0),
            totalValue: blindBoxes.reduce((sum, box) => sum + (box.price || 0), 0)
        };

        return stats;
    }

    // 购买盲盒并抽奖
    async purchaseBlindBox(blindBoxId: number, userId: number, quantity: number = 1) {
        const blindBox = await this.blindBoxModel.findOne({ where: { id: blindBoxId } });
        if (!blindBox) {
            throw new Error('盲盒不存在');
        }

        // 计算总价
        const totalPrice = blindBox.price * quantity;

        // 进行抽奖
        const results = [];
        for (let i = 0; i < quantity; i++) {
            const item = this.drawItem(blindBox.items);
            results.push(item);
        }

        return {
            blindBoxId,
            userId,
            quantity,
            totalPrice,
            items: results,
            purchaseTime: new Date()
        };
    }

    // 根据概率抽奖
    private drawItem(items: { name: string; probability: number }[]) {
        const random = Math.random();
        let cumulativeProbability = 0;

        for (const item of items) {
            cumulativeProbability += item.probability;
            if (random <= cumulativeProbability) {
                return item;
            }
        }

        // 如果概率总和不为1，返回最后一个物品
        return items[items.length - 1];
    }
}
