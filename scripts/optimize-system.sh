#!/bin/bash

# 系统优化脚本 - 针对2核2G服务器
# System Optimization Script for 2-core 2GB servers

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# 检查是否为root用户
check_root() {
    if [ "$EUID" -ne 0 ]; then
        log_error "请以root权限运行此脚本"
        log_info "使用: sudo $0"
        exit 1
    fi
}

# 备份配置文件
backup_config() {
    local file=$1
    if [ -f "$file" ]; then
        cp "$file" "${file}.backup.$(date +%Y%m%d_%H%M%S)"
        log_info "已备份: $file"
    fi
}

# 优化内核参数
optimize_kernel_params() {
    log_step "优化内核参数..."
    
    backup_config "/etc/sysctl.conf"
    
    cat >> /etc/sysctl.conf << EOF

# === 2核2G服务器优化参数 ===
# 内存管理优化
vm.swappiness=10
vm.vfs_cache_pressure=50
vm.dirty_ratio=15
vm.dirty_background_ratio=5

# 网络优化
net.core.rmem_max=16777216
net.core.wmem_max=16777216
net.ipv4.tcp_rmem=4096 65536 16777216
net.ipv4.tcp_wmem=4096 65536 16777216
net.ipv4.tcp_congestion_control=bbr
net.core.default_qdisc=fq

# 文件系统优化
fs.file-max=65536
fs.inotify.max_user_watches=524288

# 安全优化
net.ipv4.conf.all.rp_filter=1
net.ipv4.conf.default.rp_filter=1
net.ipv4.icmp_echo_ignore_broadcasts=1
net.ipv4.icmp_ignore_bogus_error_responses=1
net.ipv4.tcp_syncookies=1
EOF

    sysctl -p
    log_info "内核参数优化完成"
}

# 优化系统限制
optimize_limits() {
    log_step "优化系统限制..."
    
    backup_config "/etc/security/limits.conf"
    
    cat >> /etc/security/limits.conf << EOF

# === 2核2G服务器限制优化 ===
* soft nofile 65536
* hard nofile 65536
* soft nproc 32768
* hard nproc 32768
root soft nofile 65536
root hard nofile 65536
EOF

    log_info "系统限制优化完成"
}

# 配置swap
optimize_swap() {
    log_step "检查和优化swap配置..."
    
    local swap_size=$(free -m | awk '/^Swap:/ {print $2}')
    
    if [ "$swap_size" -eq 0 ]; then
        log_warning "未检测到swap分区"
        read -p "是否创建1GB swap文件? (y/n): " create_swap
        
        if [ "$create_swap" = "y" ] || [ "$create_swap" = "Y" ]; then
            log_info "创建swap文件..."
            fallocate -l 1G /swapfile
            chmod 600 /swapfile
            mkswap /swapfile
            swapon /swapfile
            echo '/swapfile none swap sw 0 0' >> /etc/fstab
            log_info "swap文件创建完成"
        fi
    else
        log_info "当前swap大小: ${swap_size}MB"
    fi
}

# 清理系统
clean_system() {
    log_step "清理系统垃圾文件..."
    
    # 清理包管理器缓存
    if command -v apt-get >/dev/null 2>&1; then
        apt-get autoremove -y
        apt-get autoclean
        apt-get clean
    elif command -v yum >/dev/null 2>&1; then
        yum clean all
    fi
    
    # 清理日志文件
    find /var/log -type f -name "*.log" -mtime +30 -delete 2>/dev/null || true
    find /var/log -type f -name "*.gz" -mtime +30 -delete 2>/dev/null || true
    
    # 清理临时文件
    find /tmp -type f -atime +7 -delete 2>/dev/null || true
    find /var/tmp -type f -atime +7 -delete 2>/dev/null || true
    
    # 清理缩略图缓存
    find /home -name ".thumbnails" -type d -exec rm -rf {} + 2>/dev/null || true
    
    log_info "系统清理完成"
}

# 优化服务
optimize_services() {
    log_step "优化系统服务..."
    
    # 禁用不必要的服务（根据实际情况调整）
    local services_to_disable=(
        "bluetooth"
        "cups"
        "avahi-daemon"
        "ModemManager"
    )
    
    for service in "${services_to_disable[@]}"; do
        if systemctl is-enabled "$service" >/dev/null 2>&1; then
            systemctl disable "$service"
            systemctl stop "$service"
            log_info "已禁用服务: $service"
        fi
    done
}

# 配置定时任务
setup_cron_jobs() {
    log_step "配置定时维护任务..."
    
    # 创建定时任务脚本
    cat > /etc/cron.daily/system-maintenance << 'EOF'
#!/bin/bash
# 每日系统维护脚本

# 清理临时文件
find /tmp -type f -atime +3 -delete 2>/dev/null
find /var/tmp -type f -atime +3 -delete 2>/dev/null

# 清理旧日志
find /var/log -type f -name "*.log" -mtime +7 -exec truncate -s 0 {} \;

# 清理npm缓存（如果存在）
if command -v npm >/dev/null 2>&1; then
    npm cache clean --force 2>/dev/null
fi

# 同步文件系统
sync

# 记录维护时间
echo "[$(date)] Daily maintenance completed" >> /var/log/system-maintenance.log
EOF

    chmod +x /etc/cron.daily/system-maintenance
    log_info "定时维护任务配置完成"
}

# 显示系统信息
show_system_info() {
    log_step "系统信息概览"
    
    echo "CPU信息:"
    lscpu | grep -E "Model name|CPU\(s\):|Thread|Core"
    echo ""
    
    echo "内存信息:"
    free -h
    echo ""
    
    echo "磁盘信息:"
    df -h /
    echo ""
    
    echo "网络信息:"
    ip route | grep default
    echo ""
    
    echo "系统负载:"
    uptime
    echo ""
}

# 主函数
main() {
    echo "=== 2核2G服务器系统优化脚本 ==="
    echo "此脚本将对系统进行性能优化配置"
    echo ""
    
    read -p "是否继续? (y/n): " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        log_info "操作已取消"
        exit 0
    fi
    
    check_root
    
    log_info "开始系统优化..."
    
    show_system_info
    
    optimize_kernel_params
    optimize_limits
    optimize_swap
    clean_system
    optimize_services
    setup_cron_jobs
    
    log_info "=== 优化完成 ==="
    log_warning "建议重启系统以使所有配置生效"
    log_info "重启命令: sudo reboot"
    
    echo ""
    echo "优化后建议:"
    echo "1. 重启系统"
    echo "2. 运行 ./scripts/monitor.sh 检查系统状态"
    echo "3. 配置nginx使用 ./examples/nginx.example.conf"
    echo "4. 查看 docs/PERFORMANCE.md 了解更多优化建议"
}

# 帮助信息
show_help() {
    echo "用法: $0 [选项]"
    echo "选项:"
    echo "  --help    显示帮助信息"
    echo "  --info    仅显示系统信息"
    echo "  --clean   仅执行系统清理"
    echo ""
    echo "默认执行完整优化流程"
}

# 参数处理
case "${1:-}" in
    "--help")
        show_help
        exit 0
        ;;
    "--info")
        show_system_info
        exit 0
        ;;
    "--clean")
        check_root
        clean_system
        exit 0
        ;;
    "")
        main
        ;;
    *)
        log_error "未知参数: $1"
        show_help
        exit 1
        ;;
esac