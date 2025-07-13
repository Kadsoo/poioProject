import { Inject, Controller, Post, Get, Body, Param } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';

@Controller('/user')
export class UserController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Post('/login')
  async login(@Body('username') username: string, @Body('password') password: string) {
    try {
      // 验证输入参数
      if (!username || !password) {
        this.ctx.status = 400;
        return {
          success: false,
          message: '用户名和密码不能为空',
          data: null
        };
      }

      const user = await this.userService.find(username, password);
      if (user) {
        // 登录成功，返回用户信息（不包含密码）
        const { password: _, ...userInfo } = user;
        return {
          success: true,
          message: '登录成功',
          data: userInfo
        };
      } else {
        this.ctx.status = 401;
        return {
          success: false,
          message: '用户名或密码错误',
          data: null
        };
      }
    } catch (error) {
      this.ctx.status = 500;
      console.error('登录失败:', error);
      return {
        success: false,
        message: '服务器内部错误',
        data: null
      };
    }
  }

  @Post('/register')
  async register(@Body('username') username: string, @Body('password') password: string) {
    try {
      // 验证输入参数
      if (!username || !password) {
        this.ctx.status = 400;
        return {
          success: false,
          message: '用户名和密码不能为空',
          data: null
        };
      }

      // 验证用户名长度
      if (username.length < 3 || username.length > 20) {
        this.ctx.status = 400;
        return {
          success: false,
          message: '用户名长度必须在3-20个字符之间',
          data: null
        };
      }

      // 验证密码长度
      if (password.length < 6) {
        this.ctx.status = 400;
        return {
          success: false,
          message: '密码长度不能少于6个字符',
          data: null
        };
      }

      const result = await this.userService.register(username, password);
      // 注册成功，返回用户信息（不包含密码）
      const { password: _, ...userInfo } = result;
      return {
        success: true,
        message: '注册成功',
        data: userInfo
      };
    } catch (error) {
      this.ctx.status = 400;
      console.error('注册失败:', error);
      return {
        success: false,
        message: error.message || '注册失败',
        data: null
      };
    }
  }

  @Get('/profile/:id')
  async getUserProfile(@Param('id') id: number) {
    try {
      const user = await this.userService.getUserById(id);
      if (user) {
        // 返回用户信息（不包含密码）
        const { password: _, ...userInfo } = user;
        return {
          success: true,
          message: '获取用户信息成功',
          data: userInfo
        };
      } else {
        this.ctx.status = 404;
        return {
          success: false,
          message: '用户不存在',
          data: null
        };
      }
    } catch (error) {
      this.ctx.status = 500;
      console.error('获取用户信息失败:', error);
      return {
        success: false,
        message: '服务器内部错误',
        data: null
      };
    }
  }

  @Get('/check-username/:username')
  async checkUsername(@Param('username') username: string) {
    try {
      const existingUser = await this.userService.findByUsername(username);
      return {
        success: true,
        message: '检查完成',
        data: {
          available: !existingUser
        }
      };
    } catch (error) {
      this.ctx.status = 500;
      console.error('检查用户名失败:', error);
      return {
        success: false,
        message: '服务器内部错误',
        data: null
      };
    }
  }
}
