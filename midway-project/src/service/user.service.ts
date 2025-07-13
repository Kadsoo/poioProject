import { Provide } from '@midwayjs/core';
import { Repository } from 'typeorm';
import { User } from '../entity';
import { InjectEntityModel } from '@midwayjs/typeorm';
import * as bcrypt from 'bcrypt';

@Provide()
export class UserService {
  @InjectEntityModel(User)
  userModel: Repository<User>;

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  private async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  public async find(username: string, password: string): Promise<User | null> {
    try {
      const users = await this.userModel.find({ where: { username: username } });
      if (users.length > 0) {
        const user = users[0];
        // 使用bcrypt验证密码
        const isPasswordValid = await this.comparePassword(password, user.password);
        if (isPasswordValid) {
          return user;
        }
      }
      return null; // 用户不存在或密码错误
    } catch (error) {
      console.error('查找用户失败:', error);
      throw error;
    }
  }

  public async findByUsername(username: string): Promise<User | null> {
    try {
      const user = await this.userModel.findOne({ where: { username: username } });
      return user;
    } catch (error) {
      console.error('根据用户名查找用户失败:', error);
      throw error;
    }
  }

  public async register(username: string, password: string, mail?: string, phone?: string): Promise<User> {
    try {
      // 检查用户名是否已存在
      const existingUser = await this.userModel.findOne({ where: { username: username } });
      if (existingUser) {
        throw new Error('用户名已存在');
      }

      // 加密密码
      const hashedPassword = await this.hashPassword(password);

      // 创建新用户 - registerDate会自动设置
      const newUser = this.userModel.create({
        username: username,
        password: hashedPassword,
        mail: mail || '',
        phone: phone || ''
      });
      const savedUser = await this.userModel.save(newUser);
      return savedUser;
    } catch (error) {
      console.error('注册用户失败:', error);
      throw error;
    }
  }

  public async getUserById(id: number): Promise<User | null> {
    try {
      const user = await this.userModel.findOne({ where: { id: id } });
      return user;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      throw error;
    }
  }

  public async updateUser(id: number, mail?: string, phone?: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ where: { id: id } });
      if (!user) {
        throw new Error('用户不存在');
      }

      // 更新用户信息
      if (mail !== undefined) {
        user.mail = mail;
      }
      if (phone !== undefined) {
        user.phone = phone;
      }

      const updatedUser = await this.userModel.save(user);
      return updatedUser;
    } catch (error) {
      console.error('更新用户信息失败:', error);
      throw error;
    }
  }
}
