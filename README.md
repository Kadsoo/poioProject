# Poio Blind Box 盲盒社区项目

## 📖 项目简介

Poio Blind Box 是一个现代化的盲盒社区平台，采用前后端分离架构，为用户提供盲盒购买、分享、交流的完整解决方案。用户可以发布盲盒、购买盲盒、分享开箱体验，并与其他用户互动。

## 🏗️ 技术架构

### 后端技术栈
- **框架**: [Midway.js](https://midwayjs.org/) - 基于 Node.js 的企业级框架
- **数据库**: SQLite - 轻量级关系型数据库
- **ORM**: TypeORM - 强大的对象关系映射工具
- **认证**: bcrypt - 密码加密
- **API文档**: Swagger - 自动生成API文档
- **开发语言**: TypeScript
- **服务器**: Koa.js

### 前端技术栈
- **框架**: React 19 - 现代化的用户界面库
- **构建工具**: Vite - 快速的构建工具
- **样式**: Tailwind CSS - 实用优先的CSS框架
- **开发语言**: JavaScript (ES6+)
- **状态管理**: React Hooks

## 🚀 项目结构

```
poioBlindBoxProject/
├── midway-project/          # 后端项目
│   ├── src/
│   │   ├── controller/     # 控制器层
│   │   ├── service/        # 服务层
│   │   ├── entity/         # 数据实体
│   │   ├── middleware/     # 中间件
│   │   └── config/         # 配置文件
│   ├── package.json
│   └── README.md
├── vite-project/           # 前端项目
│   ├── src/
│   │   ├── page/          # 页面组件
│   │   ├── components/    # 通用组件
│   │   ├── services/      # API服务
│   │   └── assets/        # 静态资源
│   ├── package.json
│   └── README.md
└── README.md              # 项目总览
```

## 🎯 核心功能

### 用户系统
- ✅ 用户注册/登录
- ✅ 用户信息管理
- ✅ 头像上传
- ✅ 用户统计信息

### 盲盒管理
- ✅ 盲盒发布
- ✅ 盲盒列表展示
- ✅ 盲盒详情查看
- ✅ 盲盒搜索和筛选
- ✅ 盲盒分类管理

### 购买系统
- ✅ 盲盒购买
- ✅ 订单管理
- ✅ 购买记录
- ✅ 抽奖结果展示

### 社交功能
- ✅ 玩家秀发布
- ✅ 点赞功能
- ✅ 评论系统
- ✅ 用户互动

### 内容管理
- ✅ 图片上传
- ✅ 内容审核
- ✅ 标签系统

## 🛠️ 安装和运行

### 环境要求
- Node.js >= 12.0.0
- npm 或 yarn

### 后端启动
```bash
# 进入后端目录
cd midway-project

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 服务器将在 http://localhost:7001 启动
```

### 前端启动
```bash
# 进入前端目录
cd vite-project

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 应用将在 http://localhost:5173 启动
```

### 数据库初始化
项目使用 SQLite 数据库，首次运行时会自动创建数据库文件 `webapp.sqlite`。

## 📚 API 文档

启动后端服务后，可以访问 Swagger API 文档：
- 地址: http://localhost:7001/swagger-ui/index.html
- 包含所有接口的详细说明和测试功能

## 🔧 开发命令

### 后端命令
```bash
npm run dev          # 启动开发服务器
npm run build        # 构建项目
npm run test         # 运行测试
npm run lint         # 代码检查
npm run test:api     # API测试
```

### 前端命令
```bash
npm run dev          # 启动开发服务器
npm run build        # 构建项目
npm run preview      # 预览构建结果
npm run lint         # 代码检查
```

## 📁 主要模块说明

### 后端模块 (midway-project)

#### 控制器 (Controller)
- `user.controller.ts` - 用户相关API
- `blindbox.controller.ts` - 盲盒相关API
- `order.controller.ts` - 订单相关API
- `playershow.controller.ts` - 玩家秀相关API
- `upload.controller.ts` - 文件上传API

#### 服务层 (Service)
- `user.service.ts` - 用户业务逻辑
- `blindbox.service.ts` - 盲盒业务逻辑
- `order.service.ts` - 订单业务逻辑
- `playershow.service.ts` - 玩家秀业务逻辑

#### 数据实体 (Entity)
- `user.entity.ts` - 用户实体
- `blindbox.entity.ts` - 盲盒实体
- `order.entity.ts` - 订单实体
- `playershow.entity.ts` - 玩家秀实体

### 前端模块 (vite-project)

#### 页面组件 (Page)
- `HomePage.jsx` - 首页
- `LoginPage.jsx` - 登录页面
- `UserSpace.jsx` - 用户空间
- `BlindBoxCreatePage.jsx` - 盲盒创建
- `BlindBoxDetailPage.jsx` - 盲盒详情
- `PlayerShowPage.jsx` - 玩家秀页面
- `CartPage.jsx` - 购物车页面

#### 通用组件 (Components)
- `AvatarUpload.jsx` - 头像上传组件
- `SquareForBx.jsx` - 盲盒展示卡片

#### API服务 (Services)
- `api.js` - 统一的API调用服务

## 🎨 界面特色

- **现代化设计**: 采用 Tailwind CSS 构建的现代化界面
- **响应式布局**: 支持桌面端和移动端
- **用户友好**: 直观的操作流程和反馈
- **实时交互**: 点赞、评论等实时功能

## 🔒 安全特性

- **密码加密**: 使用 bcrypt 进行密码加密
- **输入验证**: 服务端和客户端双重验证
- **CORS 配置**: 跨域请求安全配置
- **文件上传**: 安全的文件上传机制

## 🚀 部署说明

### 生产环境部署
```bash
# 后端部署
cd midway-project
npm run build
npm start

# 前端部署
cd vite-project
npm run build
# 将 dist 目录部署到 Web 服务器
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 Issue
- 发送邮件
- 项目讨论区

---

**Poio Blind Box** - 让盲盒体验更加精彩！ 🎁 