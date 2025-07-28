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

    // 添加静态文件服务
    const serve = require('koa-static');
    const fs = require('fs');

    // 静态文件服务配置
    this.app.use(serve(join(__dirname, '../public'), {
      maxage: 365 * 24 * 60 * 60 * 1000, // 1年缓存
      gzip: true,
      defer: false
    }));

    // SPA路由处理 - 在静态文件服务之后
    this.app.use(async (ctx, next) => {
      await next();

      // 如果是API请求，不处理
      if (ctx.path.startsWith('/api')) {
        return;
      }

      // 如果是静态文件请求，不处理
      if (ctx.path.includes('.')) {
        return;
      }

      // 只有在404时才处理前端路由
      if (ctx.status === 404) {
        const indexPath = join(__dirname, '../public/index.html');
        if (fs.existsSync(indexPath)) {
          ctx.type = 'html';
          ctx.body = fs.createReadStream(indexPath);
          ctx.status = 200; // 重置状态码
        }
      }
    });
  }
}
