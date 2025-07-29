#!/bin/bash

# 自动部署脚本模板
# 复制此文件为 deploy.sh 并根据实际情况修改配置

# 配置信息 - 请根据实际服务器环境修改
WEBSITE_ROOT="${WEBSITE_ROOT:-/www/wwwroot/yourdomain.com}"
PROJECT_DIR="${PROJECT_DIR:-/www/wwwroot/yourdomain.com/project}"
DEPLOY_LOG="${DEPLOY_LOG:-/www/wwwroot/yourdomain.com/project/deploy.log}"
BACKUP_DIR="${BACKUP_DIR:-/www/wwwroot/yourdomain.com/backups}"
WEB_USER="${WEB_USER:-www}"
WEB_GROUP="${WEB_GROUP:-www}"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$DEPLOY_LOG"
}

log_error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" | tee -a "$DEPLOY_LOG"
}

log_success() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] SUCCESS: $1${NC}" | tee -a "$DEPLOY_LOG"
}

log_warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}" | tee -a "$DEPLOY_LOG"
}

# 错误处理
set -e
trap 'log_error "部署失败，退出码: $?"' ERR

# 开始部署
log "=== 开始自动部署 ==="
log "网站根目录: $WEBSITE_ROOT"
log "项目目录: $PROJECT_DIR"
log "当前用户: $(whoami)"
log "当前目录: $(pwd)"

# 检查目录是否存在
if [ ! -d "$PROJECT_DIR" ]; then
    log_error "项目目录不存在: $PROJECT_DIR"
    exit 1
fi

# 进入项目目录
cd "$PROJECT_DIR" || {
    log_error "无法进入项目目录: $PROJECT_DIR"
    exit 1
}

# 创建备份目录
mkdir -p "$BACKUP_DIR"

# 备份当前构建文件（可选）
if [ -d "$WEBSITE_ROOT/dist" ]; then
    BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S)"
    log "备份当前构建文件到: $BACKUP_DIR/$BACKUP_NAME"
    cp -r "$WEBSITE_ROOT/dist" "$BACKUP_DIR/$BACKUP_NAME" || log_warning "备份失败"
fi

# 拉取最新代码
log "拉取最新代码..."
git fetch origin
git reset --hard origin/main
log_success "代码更新完成"

# 检查 package.json 是否存在
if [ ! -f "package.json" ]; then
    log_error "package.json 文件不存在"
    exit 1
fi

# 安装依赖
log "安装/更新依赖..."
if command -v npm >/dev/null 2>&1; then
    npm ci --production=false
    log_success "依赖安装完成"
else
    log_error "npm 命令不存在"
    exit 1
fi

# 构建项目
log "构建项目..."
npm run build
log_success "项目构建完成"

# 检查构建结果
if [ ! -d "dist" ]; then
    log_error "构建失败，dist 目录不存在"
    exit 1
fi

# 清理旧的构建文件
log "清理网站根目录..."
find "$WEBSITE_ROOT" -maxdepth 1 -type f \( -name "*.html" -o -name "*.js" -o -name "*.css" -o -name "*.map" \) -delete 2>/dev/null || true
find "$WEBSITE_ROOT" -maxdepth 1 -type d -name "assets" -exec rm -rf {} + 2>/dev/null || true

# 复制构建文件
log "复制构建文件到网站根目录..."
cp -r dist/* "$WEBSITE_ROOT/"
log_success "文件复制完成"

# 设置文件权限
log "设置文件权限..."
chown -R "$WEB_USER:$WEB_GROUP" "$WEBSITE_ROOT" 2>/dev/null || log_warning "权限设置可能失败"
find "$WEBSITE_ROOT" -type f -exec chmod 644 {} \; 2>/dev/null || log_warning "文件权限设置可能失败"
find "$WEBSITE_ROOT" -type d -exec chmod 755 {} \; 2>/dev/null || log_warning "目录权限设置可能失败"
log_success "权限设置完成"

# 清理临时文件
log "清理临时文件..."
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf dist 2>/dev/null || true

# 清理旧备份（保留最近5个）
log "清理旧备份文件..."
find "$BACKUP_DIR" -name "backup_*" -type d | sort -r | tail -n +6 | xargs rm -rf 2>/dev/null || true

# 验证部署
log "验证部署结果..."
if [ -f "$WEBSITE_ROOT/index.html" ]; then
    log_success "部署验证成功 - index.html 存在"
else
    log_error "部署验证失败 - index.html 不存在"
    exit 1
fi

# 显示磁盘使用情况
log "磁盘使用情况:"
df -h "$WEBSITE_ROOT" | tee -a "$DEPLOY_LOG"

log_success "=== 部署完成 ==="
log "部署时间: $(date)"
log "Git 提交: $(git rev-parse --short HEAD)"
log "网站地址: https://$(basename "$WEBSITE_ROOT")"

exit 0