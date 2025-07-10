import { Inject, Controller, Post, Body } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';

@Controller('/api')
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Post('/login')
  async getUser(@Body('username') username: string, @Body('password') password: string) {
    try {
      const user = await this.userService.find(username, password);
      if (user) {
        return { success: true, message: '登录成功', data: user };
      } else {
        return { success: false, message: '用户名或密码错误', data: null };
      }
    } catch (error) {
      return { success: false, message: '登录失败', data: null };
    }
  }

  @Post('/register')
  async register(@Body('username') username: string, @Body('password') password: string) {
    try {
      const user = await this.userService.register(username, password);
      return { success: true, message: '注册成功', data: user };
    } catch (error) {
      return { success: false, message: error.message || '注册失败', data: null };
    }
  }
}
