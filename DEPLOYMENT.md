# zzb2004.xyz 个人博客自动部署配置指南

## 服务器环境信息
- **服务器系统**: 阿里云 Linux (宝塔面板版)
- **域名**: zzb2004.xyz
- **Git账户**: bo天天开心 (2080083393@qq.com)
- **GitHub仓库**: https://github.com/BO0401/zzb2004
- **Webhook密钥**: zVXa9kF5Zq7tRwYb2Op6sN0lMv3eJiKxHc4Lp1TzUyGd

## 环境要求
- 阿里云 Linux 系统
- 宝塔面板 (已预装)
- Node.js 16+
- Git
- PHP 7.4+
- Nginx

## 1. 宝塔面板初始配置

### 1.1 创建网站
1. 登录宝塔面板
2. 点击「网站」→「添加站点」
3. **域名**: `zzb2004.xyz`
4. **根目录**: `/www/wwwroot/zzb2004.xyz`
5. **PHP版本**: 7.4或更高
6. **数据库**: 不创建（静态博客）

### 1.2 安装必要软件
1. 在宝塔面板「软件商店」中安装：
   - Node.js版本管理器
   - Git (如果未安装)
   - PM2管理器 (可选)

2. 安装Node.js 16+版本并设置npm镜像：
```bash
# 设置npm镜像源
npm config set registry https://registry.npmmirror.com
```

## 2. 服务器部署步骤

### 2.1 准备工作 (使用root权限)
```bash
# 1. 连接服务器 (通过宝塔面板终端或SSH)
# 如果使用SSH:
# ssh root@你的服务器IP

# 2. 进入网站根目录
cd /www/wwwroot/zzb2004.xyz

# 3. 清空目录 (如果有旧文件)
rm -rf *
rm -rf .*

# 4. 配置Git用户信息
git config --global user.name "bo天天开心"
git config --global user.email "2080083393@qq.com"
```

### 2.2 克隆项目到子目录
```bash
# 克隆仓库到zzb2004子目录
git clone https://github.com/BO0401/zzb2004.git zzb2004

# 进入项目目录
cd zzb2004

# 验证克隆成功
ls -la
git status
```

### 2.3 设置文件权限
```bash
# 设置项目目录权限
chown -R www:www /www/wwwroot/zzb2004.xyz/zzb2004
chmod -R 755 /www/wwwroot/zzb2004.xyz/zzb2004

# 设置部署脚本执行权限
chmod +x /www/wwwroot/zzb2004.xyz/zzb2004/deploy.sh
chmod 644 /www/wwwroot/zzb2004.xyz/zzb2004/webhook.php
```

### 2.4 首次构建部署
```bash
# 确保在项目目录中
cd /www/wwwroot/zzb2004.xyz/zzb2004

# 执行部署脚本进行首次构建
bash deploy.sh

# 如果deploy.sh执行成功，检查构建结果
ls -la /www/wwwroot/zzb2004.xyz/

# 应该能看到index.html和assets等文件被复制到网站根目录
```

### 2.5 配置网站根目录指向
由于项目在子目录中，需要将构建后的文件复制到网站根目录：
```bash
# 这个步骤已经在deploy.sh中自动完成
# 构建后的文件会自动复制到 /www/wwwroot/zzb2004.xyz/
```

## 3. GitHub Webhook 自动部署配置

### 3.1 复制webhook.php到网站根目录
```bash
# 将webhook.php复制到网站根目录
cp /www/wwwroot/zzb2004.xyz/zzb2004/webhook.php /www/wwwroot/zzb2004.xyz/

# 设置权限
chmod 644 /www/wwwroot/zzb2004.xyz/webhook.php
chown www:www /www/wwwroot/zzb2004.xyz/webhook.php
```

### 3.2 在GitHub仓库中设置Webhook
1. 进入仓库：https://github.com/BO0401/zzb2004
2. 点击 Settings → Webhooks → Add webhook
3. 配置如下：
   - **Payload URL**: `https://zzb2004.xyz/webhook.php`
   - **Content type**: `application/json`
   - **Secret**: `zVXa9kF5Zq7tRwYb2Op6sN0lMv3eJiKxHc4Lp1TzUyGd`
   - **Events**: 选择 "Just the push event"
   - **Active**: 勾选

### 3.3 测试Webhook
推送一个测试提交到main分支，检查是否自动部署：
```bash
# 查看webhook日志
tail -f /www/wwwroot/zzb2004.xyz/webhook.log

# 查看部署日志
tail -f /www/wwwroot/zzb2004.xyz/zzb2004/deploy.log
```

## 4. Nginx 配置优化

在宝塔面板网站设置中，点击「配置文件」，添加以下Nginx配置：

```nginx
# Vue.js 单页应用配置
location / {
    try_files $uri $uri/ /index.html;
}

# 静态资源缓存优化
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Access-Control-Allow-Origin "*";
    access_log off;
}

# Webhook处理
location = /webhook.php {
    fastcgi_pass unix:/tmp/php-cgi-74.sock;
    fastcgi_index index.php;
    include fastcgi.conf;
}

# 安全配置 - 禁止访问敏感文件
location ~ /\. {
    deny all;
    access_log off;
    log_not_found off;
}

location ~ \.(log|sh|md)$ {
    deny all;
    access_log off;
    log_not_found off;
}

# 禁止访问项目源码目录
location ^~ /zzb2004/ {
    deny all;
    access_log off;
    log_not_found off;
}

# Gzip压缩
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

## 5. SSL证书配置

### 5.1 申请SSL证书
1. 在宝塔面板中点击网站名称 `zzb2004.xyz`
2. 点击「SSL」选项卡
3. 选择「Let's Encrypt」免费证书
4. 点击「申请」
5. 申请成功后，启用「强制HTTPS」

### 5.2 更新Webhook URL
申请SSL证书后，需要更新GitHub Webhook配置：
- 将Payload URL更新为：`https://zzb2004.xyz/webhook.php`

## 6. 监控和日志管理

### 6.1 查看部署日志
```bash
# 查看webhook日志
tail -f /www/wwwroot/zzb2004.xyz/webhook.log

# 查看部署日志
tail -f /www/wwwroot/zzb2004.xyz/zzb2004/deploy.log

# 查看Nginx访问日志
tail -f /www/wwwlogs/zzb2004.xyz.log

# 查看Nginx错误日志
tail -f /www/wwwlogs/zzb2004.xyz.error.log
```

### 6.2 手动部署
如果自动部署失败，可以手动执行：
```bash
# 进入项目目录
cd /www/wwwroot/zzb2004.xyz/zzb2004

# 手动执行部署脚本
bash deploy.sh

# 检查部署结果
ls -la /www/wwwroot/zzb2004.xyz/index.html
```

### 6.3 清理日志文件
```bash
# 定期清理日志文件（可设置定时任务）
echo "" > /www/wwwroot/zzb2004.xyz/webhook.log
echo "" > /www/wwwroot/zzb2004.xyz/zzb2004/deploy.log
```

## 7. 故障排除

### 7.1 常见问题及解决方案

#### 问题1：Webhook不触发
**症状**：推送代码后网站没有更新
**解决方案**：
```bash
# 检查webhook.php是否存在
ls -la /www/wwwroot/zzb2004.xyz/webhook.php

# 检查webhook日志
tail -f /www/wwwroot/zzb2004.xyz/webhook.log

# 检查GitHub Webhook配置
# 确保Payload URL、Secret、Events配置正确
```

#### 问题2：权限问题
**症状**：Permission denied错误
**解决方案**：
```bash
# 重新设置权限
sudo chown -R www:www /www/wwwroot/zzb2004.xyz/
sudo chmod -R 755 /www/wwwroot/zzb2004.xyz/
sudo chmod +x /www/wwwroot/zzb2004.xyz/zzb2004/deploy.sh
```

#### 问题3：构建失败
**症状**：npm install或npm run build失败
**解决方案**：
```bash
# 检查Node.js版本
node --version
npm --version

# 清理npm缓存
npm cache clean --force

# 删除node_modules重新安装
cd /www/wwwroot/zzb2004.xyz/zzb2004/blog-frontend
rm -rf node_modules package-lock.json
npm install
```

#### 问题4：Git拉取失败
**症状**：git pull失败
**解决方案**：
```bash
# 检查Git状态
cd /www/wwwroot/zzb2004.xyz/zzb2004
git status
git remote -v

# 重置本地更改
git reset --hard HEAD
git clean -fd
git pull origin main
```

### 7.2 调试命令
```bash
# 检查系统环境
node --version
npm --version
git --version
php --version

# 检查项目状态
cd /www/wwwroot/zzb2004.xyz/zzb2004
git status
git log --oneline -5

# 手动测试构建
cd blog-frontend
npm install
npm run build
ls -la dist/

# 检查网站文件
ls -la /www/wwwroot/zzb2004.xyz/index.html
```

## 8. 完整使用流程

### 8.1 日常开发流程
1. **本地开发**：在 `d:\code\zzb2004` 目录修改代码
2. **本地测试**：
   ```bash
   cd blog-frontend
   npm run dev  # 本地预览
   ```
3. **提交代码**：
   ```bash
   git add .
   git commit -m "更新：添加新文章/修复bug/优化功能"
   ```
4. **推送到GitHub**：
   ```bash
   git push origin main
   ```
5. **自动部署**：GitHub Webhook自动触发服务器更新
6. **验证结果**：访问 https://zzb2004.xyz 查看更新

### 8.2 紧急修复流程
如果自动部署失败，可以手动部署：
```bash
# SSH连接服务器或使用宝塔终端
cd /www/wwwroot/zzb2004.xyz/zzb2004
bash deploy.sh
```

## 9. 安全建议

### 9.1 服务器安全
1. **定期更新**：保持系统和软件最新版本
2. **防火墙配置**：只开放必要端口（80, 443, 22）
3. **SSH安全**：
   - 使用SSH密钥认证
   - 禁用root直接登录
   - 修改默认SSH端口

### 9.2 应用安全
1. **文件权限**：确保敏感文件不可直接访问
2. **定期备份**：
   ```bash
   # 备份网站文件
   tar -czf zzb2004_backup_$(date +%Y%m%d).tar.gz /www/wwwroot/zzb2004.xyz/
   ```
3. **监控日志**：定期检查访问日志和错误日志

### 9.3 代码安全
1. **敏感信息**：不要在代码中硬编码密钥和密码
2. **依赖管理**：定期更新npm依赖包
3. **代码审查**：重要更新前进行代码审查

## 10. 维护计划

### 10.1 日常维护
- 每周检查服务器资源使用情况
- 每月清理日志文件
- 每季度更新系统和软件

### 10.2 备份策略
- 每日自动备份网站文件
- 每周备份到异地存储
- 每月测试备份恢复

---

## 🎉 部署完成！

配置完成后，你的个人博客就可以实现：
- ✅ 本地开发，推送代码到GitHub
- ✅ 服务器自动拉取最新代码
- ✅ 自动构建Vue项目
- ✅ 自动部署到生产环境
- ✅ 通过 https://zzb2004.xyz 访问最新内容

**享受你的自动化博客部署体验吧！** 🚀