const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始构建 Poio Blind Box 项目...');

// 构建步骤
async function build() {
    try {
        // 1. 构建前端
        console.log('📦 构建前端...');
        execSync('cd vite-project && npm run build', { stdio: 'inherit' });

        // 2. 创建后端public目录
        const publicDir = path.join(__dirname, 'midway-project/public');
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
        }

        // 3. 复制前端构建产物到后端public目录
        console.log('📋 复制前端构建产物...');
        const frontendDist = path.join(__dirname, 'vite-project/dist');
        const backendPublic = path.join(__dirname, 'midway-project/public');

        // 复制所有文件
        copyDir(frontendDist, backendPublic);

        // 4. 替换构建文件中的跳转代码
        console.log('🔧 修复跳转代码...');
        const jsFiles = findJsFiles(backendPublic);
        jsFiles.forEach(file => {
            let content = fs.readFileSync(file, 'utf8');
            // 替换跳转代码
            content = content.replace(
                /window\.location\.href\s*=\s*`\/profile\/\$\{T\.data\.id\}`/g,
                'console.log("跳转被阻止");'
            );
            content = content.replace(
                /window\.location\.href\s*=\s*`\/profile\/\$\{[^}]+\}`/g,
                'console.log("跳转被阻止");'
            );
            fs.writeFileSync(file, content);
        });

        // 5. 复制数据库文件
        console.log('🗄️ 复制数据库文件...');
        const dbFile = path.join(__dirname, 'midway-project/webapp.sqlite');
        if (fs.existsSync(dbFile)) {
            fs.copyFileSync(dbFile, path.join(backendPublic, 'webapp.sqlite'));
        }

        // 6. 创建部署包
        console.log('📦 创建部署包...');
        const deployDir = path.join(__dirname, 'deploy');
        if (!fs.existsSync(deployDir)) {
            fs.mkdirSync(deployDir, { recursive: true });
        }

        // 复制后端文件到部署目录
        copyDir(path.join(__dirname, 'midway-project'), deployDir);

        // 删除不需要的文件
        const filesToRemove = [
            'node_modules',
            'logs',
            'test',
            'src/test',
            'coverage',
            '.nyc_output',
            'test-api.js',
            'test-api-fix.js',
            'test-api-simple.js',
            'test-backend.js'
        ];

        filesToRemove.forEach(file => {
            const filePath = path.join(deployDir, file);
            if (fs.existsSync(filePath)) {
                if (fs.lstatSync(filePath).isDirectory()) {
                    fs.rmSync(filePath, { recursive: true, force: true });
                } else {
                    fs.unlinkSync(filePath);
                }
            }
        });

        // 7. 创建启动脚本
        console.log('📝 创建启动脚本...');
        const startScript = `#!/bin/bash
echo "🚀 启动 Poio Blind Box 应用..."

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到Node.js，请先安装Node.js"
    exit 1
fi

# 安装依赖
echo "📦 安装依赖..."
npm install --production

# 启动应用
echo "🌟 启动应用..."
npm start

echo "✅ 应用已启动，访问 http://localhost:7001"
`;

        fs.writeFileSync(path.join(deployDir, 'start.sh'), startScript);
        fs.chmodSync(path.join(deployDir, 'start.sh'), '755');

        // 创建Windows启动脚本
        const startScriptWin = `@echo off
echo 🚀 启动 Poio Blind Box 应用...

REM 检查Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到Node.js，请先安装Node.js
    pause
    exit /b 1
)

REM 安装依赖
echo 📦 安装依赖...
npm install --production

REM 启动应用
echo 🌟 启动应用...
npm start

echo ✅ 应用已启动，访问 http://localhost:7001
pause
`;

        fs.writeFileSync(path.join(deployDir, 'start.bat'), startScriptWin);

        // 8. 创建README
        console.log('📖 创建部署说明...');
        const deployReadme = `# Poio Blind Box 部署包

## 🚀 快速启动

### Linux/Mac
\`\`\`bash
chmod +x start.sh
./start.sh
\`\`\`

### Windows
\`\`\`cmd
start.bat
\`\`\`

## 📋 系统要求

- Node.js >= 12.0.0
- npm 或 yarn

## 🌐 访问地址

启动后访问: http://localhost:7001

## 📁 文件结构

- \`public/\` - 前端构建产物
- \`webapp.sqlite\` - 数据库文件
- \`package.json\` - 项目依赖
- \`start.sh\` / \`start.bat\` - 启动脚本

## 🔧 配置说明

- 端口: 7001
- 数据库: SQLite (webapp.sqlite)
- 静态文件: public目录

## 📞 技术支持

如有问题，请查看项目文档或提交Issue。
`;

        fs.writeFileSync(path.join(deployDir, 'README.md'), deployReadme);

        console.log('✅ 构建完成！');
        console.log('📁 部署包位置:', deployDir);
        console.log('🚀 运行以下命令启动应用:');
        console.log('   Linux/Mac: cd deploy && ./start.sh');
        console.log('   Windows: cd deploy && start.bat');

    } catch (error) {
        console.error('❌ 构建失败:', error.message);
        process.exit(1);
    }
}

// 复制目录函数
function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// 查找JS文件函数
function findJsFiles(dir) {
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...findJsFiles(fullPath));
        } else if (entry.name.endsWith('.js')) {
            files.push(fullPath);
        }
    }

    return files;
}

// 执行构建
build(); 