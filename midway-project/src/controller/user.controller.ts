import { Controller, Get, Post, Put, Param, Body, Inject } from '@midwayjs/core';
import { UserService } from '../service/user.service';

@Controller('/api/user')
export class UserController {
  @Inject() userService: UserService;

  // 用户注册
  @Post('/register')
  async register(@Body() data: any) {
    try {
      const { username, password } = data;

      // 验证必填字段
      if (!username || !password) {
        return { success: false, message: '用户名和密码不能为空' };
      }

      if (username.length < 3 || username.length > 20) {
        return { success: false, message: '用户名长度必须在3-20个字符之间' };
      }

      if (password.length < 6) {
        return { success: false, message: '密码长度不能少于6个字符' };
      }

      const result = await this.userService.register(data);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // 用户登录
  @Post('/login')
  async login(@Body() data: any) {
    try {
      const { username, password } = data;

      if (!username || !password) {
        return { success: false, message: '用户名和密码不能为空' };
      }

      const result = await this.userService.login(username, password);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // 检查用户名是否可用
  @Get('/check-username/:username')
  async checkUsername(@Param('username') username: string) {
    try {
      const isAvailable = await this.userService.checkUsername(username);
      return { success: true, data: { isAvailable } };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // 获取用户信息
  @Get('/:userId')
  async getUserInfo(@Param('userId') userId: number) {
    try {
      const user = await this.userService.getUserInfo(userId);
      if (!user) {
        return { success: false, message: '用户不存在' };
      }
      return { success: true, data: user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // 更新用户信息
  @Put('/:userId')
  async updateUserInfo(@Param('userId') userId: number, @Body() data: any) {
    try {
      const user = await this.userService.updateUserInfo(userId, data);
      return { success: true, data: user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // 获取用户统计数据
  @Get('/:userId/stats')
  async getUserStats(@Param('userId') userId: number) {
    try {
      const stats = await this.userService.getUserStats(userId);
      return { success: true, data: stats };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
