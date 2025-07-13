# Poio Blind Box 后端API

## 项目结构

```
midway-project/
├── src/
│   ├── controller/          # 控制器层
│   │   ├── home.controller.ts    # 首页和系统API
│   │   └── user.controller.ts    # 用户相关API
│   ├── service/            # 服务层
│   │   └── user.service.ts       # 用户服务
│   ├── entity/             # 实体层
│   │   └── user.entity.ts        # 用户实体
│   ├── config/             # 配置
│   │   └── config.default.ts     # 默认配置
│   └── configuration.ts    # 应用配置
├── test-api.js            # API测试脚本
└── package.json           # 项目依赖
```

## 启动步骤

1. **安装依赖**
   ```bash
   npm install
   ```

2. **启动开发服务器**
   ```bash
   npm run dev
   ```
   服务器将在 http://localhost:7001 启动

3. **测试API**
   ```bash
   npm run test:api
   ```

## API端点

### 系统API

- `GET /` - 首页
- `GET /health` - 健康检查
- `GET /api-info` - API信息

### 用户API

- `POST /user/login` - 用户登录
- `POST /user/register` - 用户注册
- `GET /user/profile/:id` - 获取用户信息
- `GET /user/check-username/:username` - 检查用户名是否可用

## 请求示例

### 用户注册
```bash
curl -X POST http://localhost:7001/user/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "123456"}'
```

### 用户登录
```bash
curl -X POST http://localhost:7001/user/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "123456"}'
```

## 响应格式

所有API都返回统一的JSON格式：

```json
{
  "success": true,
  "message": "操作成功",
  "data": {
    // 具体数据
  }
}
```

## 错误处理

- `400` - 请求参数错误
- `401` - 认证失败
- `404` - 资源不存在
- `500` - 服务器内部错误

## 安全特性

- 密码使用bcrypt加密存储
- CORS配置支持前端开发服务器
- 输入验证和错误处理
- 密码长度和用户名长度验证

## 数据库

使用SQLite数据库，文件位置：`webapp.sqlite`

数据库会自动创建和同步，无需手动初始化。 