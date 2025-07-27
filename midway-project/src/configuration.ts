import { Configuration, App } from '@midwayjs/core';
import { join } from 'path';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import * as typeorm from '@midwayjs/typeorm';
import * as swagger from '@midwayjs/swagger';
import * as cors from '@koa/cors';
import { DefaultErrorFilter } from './filter/default.filter';
import { NotFoundFilter } from './filter/notfound.filter';
import { ReportMiddleware } from './middleware/report.middleware';

@Configuration({
  imports: [
    koa,
    validate,
    typeorm,
    swagger,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class MainConfiguration {
  @App('koa')
  app: koa.Application;

  async onReady() {
    // 添加 CORS 支持 - 配置更详细的选项
    this.app.use(cors({
      origin: '*',
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
      credentials: true
    }));

    // 添加错误过滤器
    this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
    this.app.useMiddleware([ReportMiddleware]);

    // 添加静态文件服务 - 只在非API路径时提供
    const serve = require('koa-static');
    const staticMiddleware = serve(join(__dirname, '../public'));

    this.app.use(async (ctx, next) => {
      // 如果是API请求，跳过静态文件服务
      if (ctx.path.startsWith('/api/')) {
        await next();
      } else {
        // 非API请求才提供静态文件服务
        await staticMiddleware(ctx, next);
      }
    });
  }
}
