#!/bin/bash
# zzb2004.xyz 个人博客自动部署脚本
# 作者: bo天天开心
# 邮箱: 2080083393@qq.com
# GitHub: https://github.com/BO0401/zzb2004

# 设置日志文件
LOG_FILE="/www/wwwroot/zzb2004.xyz/zzb2004/deploy.log"
WEBSITE_ROOT="/www/wwwroot/zzb2004.xyz"
PROJECT_DIR="/www/wwwroot/zzb2004.xyz/zzb2004"

# 记录日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "========== 开始部署 =========="

# 检查项目目录是否存在
if [ ! -d "$PROJECT_DIR" ]; then
    log "错误: 项目目录不存在: $PROJECT_DIR"
    exit 1
fi

# 进入项目目录
cd "$PROJECT_DIR"
log "当前目录: $(pwd)"

# 拉取最新代码
log "正在拉取最新代码..."
git pull origin main

if [ $? -ne 0 ]; then
    log "错误: Git拉取失败!"
    exit 1
fi

log "代码拉取成功"

# 检查前端目录是否存在
if [ ! -d "blog-frontend" ]; then
    log "错误: blog-frontend目录不存在"
    exit 1
fi

# 进入前端目录
cd blog-frontend
log "进入前端目录: $(pwd)"

# 清理旧的依赖和构建文件
log "清理旧文件..."
rm -rf node_modules/.cache
rm -rf dist

# 安装依赖
log "正在安装依赖..."
npm install --production=false

if [ $? -ne 0 ]; then
    log "错误: 依赖安装失败!"
    exit 1
fi

log "依赖安装成功"

# 构建项目
log "正在构建项目..."
npm run build

if [ $? -ne 0 ]; then
    log "错误: 项目构建失败!"
    exit 1
fi

log "项目构建成功"

# 检查构建结果
if [ ! -d "dist" ]; then
    log "错误: 构建目录不存在"
    exit 1
fi

# 备份旧文件（可选）
log "备份旧文件..."
if [ -f "$WEBSITE_ROOT/index.html" ]; then
    mkdir -p "$WEBSITE_ROOT/backup"
    cp -r "$WEBSITE_ROOT"/*.html "$WEBSITE_ROOT/backup/" 2>/dev/null || true
    cp -r "$WEBSITE_ROOT/assets" "$WEBSITE_ROOT/backup/" 2>/dev/null || true
fi

# 复制构建文件到网站根目录
log "正在部署文件到网站根目录..."
cp -r dist/* "$WEBSITE_ROOT/"

if [ $? -ne 0 ]; then
    log "错误: 文件复制失败!"
    exit 1
fi

log "文件部署成功"

# 设置文件权限
log "设置文件权限..."
chown -R www:www "$WEBSITE_ROOT"
chmod -R 755 "$WEBSITE_ROOT"
chmod 644 "$WEBSITE_ROOT"/*.html 2>/dev/null || true
chmod 644 "$WEBSITE_ROOT"/*.php 2>/dev/null || true

# 清理临时文件
log "清理临时文件..."
cd "$PROJECT_DIR/blog-frontend"
rm -rf node_modules/.cache

# 验证部署结果
if [ -f "$WEBSITE_ROOT/index.html" ]; then
    log "✅ 部署验证成功: index.html存在"
else
    log "❌ 部署验证失败: index.html不存在"
    exit 1
fi

log "========== 部署完成 =========="
log "网站地址: https://zzb2004.xyz"
log "部署时间: $(date '+%Y-%m-%d %H:%M:%S')"
log "构建文件数量: $(ls -1 $WEBSITE_ROOT/*.html 2>/dev/null | wc -l)"

echo "部署成功! 请访问 https://zzb2004.xyz 查看最新内容"