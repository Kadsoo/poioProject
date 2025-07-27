import { Catch } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

@Catch()
export class DefaultErrorFilter {
  async catch(err: Error, ctx: Context) {
    // 设置CORS头
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    ctx.set('Access-Control-Allow-Credentials', 'true');

    // 所有的未分类错误会到这里
    return {
      success: false,
      message: err.message,
    };
  }
}
