import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { BlindBoxService } from './blindbox.service';
import { OrderService } from './order.service';
import * as bcrypt from 'bcrypt';

@Provide()
export class UserService {
  @InjectEntityModel(User) userModel: Repository<User>;

  constructor(
    private blindBoxService: BlindBoxService,
    private orderService: OrderService
  ) { }

  // 用户注册
  async register(data: any) {
    const { username, password, mail, phone } = data;

    // 检查用户名是否已存在
    const existingUser = await this.userModel.findOne({ where: { username } });
    if (existingUser) {
      throw new Error('用户名已存在');
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建新用户
    const user = this.userModel.create({
      username,
      password: hashedPassword,
      mail: mail || '',
      phone: phone || ''
    });

    const savedUser = await this.userModel.save(user);

    // 返回用户信息（不包含密码）
    const { password: _, ...userInfo } = savedUser;
    return userInfo;
  }

  // 用户登录
  async login(username: string, password: string) {
    const user = await this.userModel.findOne({ where: { username } });
    if (!user) {
      throw new Error('用户名或密码错误');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('用户名或密码错误');
    }

    // 返回用户信息（不包含密码）
    const { password: _, ...userInfo } = user;
    return userInfo;
  }

  // 检查用户名是否可用
  async checkUsername(username: string) {
    const existingUser = await this.userModel.findOne({ where: { username } });
    return !existingUser;
  }

  // 获取用户信息
  async getUserInfo(userId: number) {
    return await this.userModel.findOne({ where: { id: userId } });
  }

  // 更新用户信息
  async updateUserInfo(userId: number, data: Partial<User>) {
    const user = await this.userModel.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('用户不存在');
    }

    Object.assign(user, data);
    return await this.userModel.save(user);
  }

  // 获取用户统计数据
  async getUserStats(userId: number) {
    const [blindBoxStats, orderStats] = await Promise.all([
      this.blindBoxService.getBlindBoxStats(userId),
      this.orderService.getUserOrderStats(userId)
    ]);

    return {
      blindBoxStats,
      orderStats,
      totalStats: {
        totalBlindBoxes: blindBoxStats.total,
        totalOrders: orderStats.total,
        totalLikes: blindBoxStats.totalLikes,
        totalAmount: orderStats.totalAmount
      }
    };
  }
}
