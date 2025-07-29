# 性能优化指南

本文档针对2核2G服务器提供详细的性能优化方案。

## 🚀 前端优化

### 1. 构建优化

已在 `vite.config.ts` 中配置：

- **代码分割**：将Vue、Element Plus、工具库分离为独立chunks
- **压缩优化**：使用Terser压缩，移除console和debugger
- **资源优化**：按类型分类静态资源，优化文件名
- **依赖预构建**：预构建常用依赖以提升开发体验

### 2. 包大小优化

```bash
# 分析包大小
npm run build
npx vite-bundle-analyzer dist

# 检查依赖大小
npx bundlephobia [package-name]
```

### 3. 运行时优化

- 懒加载路由组件
- 图片懒加载
- 虚拟滚动（大列表）
- 防抖和节流

## 🔧 服务器优化

### 1. Nginx 配置

使用 `scripts/nginx.example.conf` 配置：

- **工作进程**：设置为CPU核心数（2）
- **Gzip压缩**：压缩文本资源
- **静态资源缓存**：长期缓存静态文件
- **连接优化**：keepalive、sendfile等

### 2. 系统级优化

#### 内存优化
```bash
# 调整swap使用策略
echo 'vm.swappiness=10' >> /etc/sysctl.conf

# 优化文件系统缓存
echo 'vm.vfs_cache_pressure=50' >> /etc/sysctl.conf

# 应用配置
sysctl -p
```

#### 网络优化
```bash
# TCP优化
echo 'net.core.rmem_max = 16777216' >> /etc/sysctl.conf
echo 'net.core.wmem_max = 16777216' >> /etc/sysctl.conf
echo 'net.ipv4.tcp_rmem = 4096 65536 16777216' >> /etc/sysctl.conf
echo 'net.ipv4.tcp_wmem = 4096 65536 16777216' >> /etc/sysctl.conf
```

### 3. 进程管理

#### 使用PM2管理Node.js应用（如果有）
```bash
# 安装PM2
npm install -g pm2

# 配置文件 ecosystem.config.js
module.exports = {
  apps: [{
    name: 'blog-api',
    script: './server.js',
    instances: 1,  // 2G内存建议单实例
    max_memory_restart: '512M',
    node_args: '--max-old-space-size=512'
  }]
}
```

## 📊 监控与维护

### 1. 性能监控

使用 `scripts/monitor.sh`：

```bash
# 完整监控
./scripts/monitor.sh monitor

# 快速状态
./scripts/monitor.sh quick

# 清理缓存（需要root权限）
sudo ./scripts/monitor.sh clean
```

### 2. 定期维护

#### 设置定时任务
```bash
# 编辑crontab
crontab -e

# 添加以下任务
# 每小时检查系统状态
0 * * * * /path/to/scripts/monitor.sh quick >> /var/log/hourly-check.log

# 每天凌晨2点清理日志
0 2 * * * find /var/log -name "*.log" -mtime +7 -delete

# 每周清理npm缓存
0 2 * * 0 npm cache clean --force
```

### 3. 日志管理

```bash
# 配置logrotate
sudo nano /etc/logrotate.d/nginx

# 内容：
/var/log/nginx/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 nginx nginx
    postrotate
        systemctl reload nginx
    endscript
}
```

## ⚡ 部署优化

### 1. 构建优化

在 `scripts/deploy.example.sh` 中已配置：

- Node.js内存限制：1024MB
- npm并发限制：3个连接
- 缓存清理：自动清理npm缓存
- 环境变量：生产环境优化

### 2. 资源清理

```bash
# 清理Docker（如果使用）
docker system prune -f

# 清理包管理器缓存
apt-get clean
yum clean all

# 清理临时文件
find /tmp -type f -atime +7 -delete
```

## 🔍 性能测试

### 1. 前端性能测试

```bash
# 使用Lighthouse
npm install -g lighthouse
lighthouse https://yourdomain.com --output html --output-path ./lighthouse-report.html

# 使用WebPageTest
# 访问 https://www.webpagetest.org/
```

### 2. 服务器压力测试

```bash
# 使用ab测试
apt-get install apache2-utils
ab -n 1000 -c 10 https://yourdomain.com/

# 使用wrk测试
git clone https://github.com/wg/wrk.git
cd wrk && make
./wrk -t2 -c10 -d30s https://yourdomain.com/
```

## 📈 性能指标

### 目标指标（2核2G服务器）

- **CPU使用率**：< 70%（平均）
- **内存使用率**：< 80%
- **磁盘使用率**：< 85%
- **响应时间**：< 200ms（静态资源）
- **并发连接**：< 100（同时）

### 关键性能指标（KPI）

- **首屏加载时间**：< 2秒
- **完全加载时间**：< 5秒
- **Lighthouse评分**：> 90分
- **服务器响应时间**：< 100ms

## 🚨 告警阈值

在 `scripts/monitor.sh` 中配置：

- **CPU告警**：> 80%
- **内存告警**：> 85%
- **磁盘告警**：> 90%
- **负载告警**：> 2.0（2核服务器）

## 💡 优化建议

### 短期优化
1. 启用Gzip压缩
2. 配置静态资源缓存
3. 优化图片格式（WebP）
4. 启用HTTP/2

### 中期优化
1. 实施CDN
2. 数据库查询优化
3. 缓存策略优化
4. 代码分割细化

### 长期优化
1. 服务器升级
2. 微服务架构
3. 容器化部署
4. 自动扩缩容

## 📚 相关文档

- [Vite 性能优化](https://vitejs.dev/guide/build.html#build-optimizations)
- [Nginx 性能调优](https://nginx.org/en/docs/)
- [Vue.js 性能优化](https://vuejs.org/guide/best-practices/performance.html)
- [Web 性能优化](https://web.dev/performance/)