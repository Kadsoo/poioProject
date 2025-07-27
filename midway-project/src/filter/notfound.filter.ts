import { Catch, httpError, MidwayHttpError } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

@Catch(httpError.NotFoundError)
export class NotFoundFilter {
  async catch(err: MidwayHttpError, ctx: Context) {
    // 设置CORS头
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    ctx.set('Access-Control-Allow-Credentials', 'true');

    // 对于API请求，返回JSON格式的404错误
    if (ctx.path.startsWith('/api/')) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: 'API接口不存在',
        path: ctx.path
      };
    } else {
      // 对于非API请求，返回404状态码
      ctx.status = 404;
      ctx.body = '页面未找到';
    }
  }
}
