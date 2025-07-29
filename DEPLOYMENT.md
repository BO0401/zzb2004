# zzb2004.xyz 博客自动部署配置指南

## 服务器环境要求
- Linux 系统
- 宝塔面板
- Node.js 16+
- Git
- PHP 7.4+

## 1. 宝塔面板配置

### 1.1 创建网站
1. 登录宝塔面板
2. 点击「网站」→「添加站点」
3. 域名：`zzb2004.xyz`
4. 根目录：`/www/wwwroot/zzb2004.xyz`
5. PHP版本：7.4或更高

### 1.2 安装Node.js
1. 在宝塔面板「软件商店」中安装「Node.js版本管理器」
2. 安装Node.js 16+版本
3. 设置npm镜像：
```bash
npm config set registry https://registry.npmmirror.com
```

## 2. 服务器部署步骤

### 2.1 初始部署
```bash
# SSH连接服务器
ssh root@你的服务器IP

# 进入网站目录
cd /www/wwwroot/zzb2004.xyz

# 克隆仓库
git clone https://github.com/BO0401/zzb2004.git .

# 上传部署脚本
# 将 deploy.sh 上传到 /www/wwwroot/zzb2004.xyz/
chmod +x deploy.sh

# 上传webhook处理文件
# 将 webhook.php 上传到 /www/wwwroot/zzb2004.xyz/

# 首次构建
cd blog-frontend
npm install
npm run build
cp -r dist/* ../
```

### 2.2 设置文件权限
```bash
chmod +x /www/wwwroot/zzb2004.xyz/deploy.sh
chmod 644 /www/wwwroot/zzb2004.xyz/webhook.php
chown -R www:www /www/wwwroot/zzb2004.xyz
```

## 3. GitHub Webhook 配置

### 3.1 在GitHub仓库中设置Webhook
1. 进入仓库：https://github.com/BO0401/zzb2004
2. 点击 Settings → Webhooks → Add webhook
3. 配置如下：
   - **Payload URL**: `https://zzb2004.xyz/webhook.php`
   - **Content type**: `application/json`
   - **Secret**: `zVXa9kF5Zq7tRwYb2Op6sN0lMv3eJiKxHc4Lp1TzUyGd`
   - **Events**: 选择 "Just the push event"
   - **Active**: 勾选

### 3.2 测试Webhook
推送一个测试提交到main分支，检查是否自动部署。

## 4. Nginx 配置优化

在宝塔面板网站设置中，添加以下Nginx配置：

```nginx
# Vue.js 单页应用配置
location / {
    try_files $uri $uri/ /index.html;
}

# 静态资源缓存
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Access-Control-Allow-Origin "*";
}

# API代理（如果需要）
location /api/ {
    proxy_pass http://localhost:3000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# 安全配置
location ~ /\. {
    deny all;
}

location ~ \.(log|sh)$ {
    deny all;
}
```

## 5. SSL证书配置

1. 在宝塔面板中为 `zzb2004.xyz` 申请SSL证书
2. 启用强制HTTPS
3. 更新GitHub Webhook URL为 `https://zzb2004.xyz/webhook.php`

## 6. 监控和日志

### 6.1 查看部署日志
```bash
# 查看webhook日志
tail -f /www/wwwroot/zzb2004.xyz/webhook.log

# 查看部署日志
tail -f /www/wwwroot/zzb2004.xyz/deploy.log
```

### 6.2 手动部署
如果自动部署失败，可以手动执行：
```bash
cd /www/wwwroot/zzb2004.xyz
bash deploy.sh
```

## 7. 故障排除

### 7.1 常见问题
1. **Webhook不触发**：检查GitHub Webhook配置和密钥
2. **构建失败**：检查Node.js版本和依赖
3. **权限问题**：确保www用户有执行权限
4. **Git拉取失败**：检查服务器网络和Git配置

### 7.2 调试命令
```bash
# 检查Node.js版本
node --version
npm --version

# 检查Git状态
cd /www/wwwroot/zzb2004.xyz
git status
git log --oneline -5

# 测试构建
cd blog-frontend
npm run build
```

## 8. 使用流程

1. **开发**：在本地修改代码
2. **提交**：`git add . && git commit -m "更新内容"`
3. **推送**：`git push origin main`
4. **自动部署**：GitHub自动触发webhook，服务器自动更新
5. **访问**：https://zzb2004.xyz

## 9. 安全建议

1. 定期更新服务器系统和软件
2. 设置防火墙规则
3. 定期备份网站数据
4. 监控服务器资源使用情况
5. 使用强密码和SSH密钥认证

---

配置完成后，每次推送代码到GitHub的main分支，服务器都会自动拉取最新代码并重新构建部署！