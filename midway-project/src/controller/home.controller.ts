import { Controller, Get } from '@midwayjs/core';

@Controller('/')
export class HomeController {
  @Get('/')
  async home(): Promise<string> {
    return 'Hello Midwayjs!';
  }

  @Get('/health')
  async health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'poio-blindbox-backend',
      version: '1.0.0'
    };
  }

  @Get('/api-info')
  async apiInfo() {
    return {
      name: 'Poio Blind Box API',
      version: '1.0.0',
      endpoints: {
        auth: {
          'POST /user/login': '用户登录',
          'POST /user/register': '用户注册',
          'GET /user/profile/:id': '获取用户信息',
          'GET /user/check-username/:username': '检查用户名是否可用'
        },
        system: {
          'GET /health': '健康检查',
          'GET /api-info': 'API信息'
        }
      }
    };
  }

  // 添加一个测试路由，用于验证前端路由
  @Get('/test-spa')
  async testSPA() {
    return {
      message: 'SPA路由测试成功',
      timestamp: new Date().toISOString()
    };
  }
}
