import { Provide } from '@midwayjs/core';
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

    // 展示全部盲盒
    async getAllBlindBoxes() {
        return await this.blindBoxModel.find();
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
    async likeBlindBox(id: number) {
        const box = await this.blindBoxModel.findOne({ where: { id } });
        if (!box) throw new Error('盲盒不存在');
        box.likes += 1;
        return await this.blindBoxModel.save(box);
    }

    // 取消点赞
    async unlikeBlindBox(id: number) {
        const box = await this.blindBoxModel.findOne({ where: { id } });
        if (!box) throw new Error('盲盒不存在');
        box.likes = Math.max(0, box.likes - 1);
        return await this.blindBoxModel.save(box);
    }

    // 添加评论（假设 comments 字段为 simple-json，实际可扩展为独立表）
    async addComment(id: number, comment: { userId: number; content: string; time?: Date }) {
        const box = await this.blindBoxModel.findOne({ where: { id } });
        if (!box) throw new Error('盲盒不存在');
        // 假设 comments 字段存在
        let comments = (box as any).comments || [];
        comments.push({ ...comment, time: comment.time || new Date() });
        (box as any).comments = comments;
        return await this.blindBoxModel.save(box);
    }

    // 获取用户的盲盒列表
    async getUserBlindBoxes(userId: number) {
        return await this.blindBoxModel.find({
            where: { userId },
            order: { posttime: 'DESC' }
        });
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
}
