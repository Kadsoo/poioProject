# 使用官方Node.js镜像作为基础镜像
FROM node:16-alpine

# 设置工作目录
WORKDIR /app

# 复制package.json文件
COPY midway-project/package*.json ./

# 安装依赖
RUN npm install --production

# 复制应用代码
COPY midway-project/ ./

# 复制前端构建产物
COPY midway-project/public ./public

# 暴露端口
EXPOSE 7001

# 启动应用
CMD ["npm", "start"] 