import { Provide } from '@midwayjs/core';
import { Repository } from 'typeorm';
import { User } from '../entity';
import { InjectEntityModel } from '@midwayjs/typeorm';

@Provide()
export class UserService {
  @InjectEntityModel(User)
  userModel: Repository<User>;

  public async find(username: string, password: string) {
    try {
      const users = await this.userModel.find({ where: { username: username } });
      if (users.length > 0) {
        if (users[0].password === password) {
          return users[0];
        }
      }
      return null; // 用户不存在或密码错误
    } catch (error) {
      console.error('查找用户失败:', error);
      throw error;
    }
  }

  public async register(username: string, password: string) {
    try {
      // 检查用户名是否已存在
      const existingUser = await this.userModel.findOne({ where: { username: username } });
      if (existingUser) {
        throw new Error('用户名已存在');
      }

      // 创建新用户
      const newUser = this.userModel.create({ username: username, password: password });
      return await this.userModel.save(newUser);
    } catch (error) {
      console.error('注册用户失败:', error);
      throw error;
    }
  }
}
