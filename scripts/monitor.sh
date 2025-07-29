#!/bin/bash

# 服务器性能监控脚本
# 适用于2核2G服务器的资源监控

# 配置
LOG_FILE="/var/log/server-monitor.log"
ALERT_THRESHOLD_CPU=80
ALERT_THRESHOLD_MEM=85
ALERT_THRESHOLD_DISK=90

# 颜色定义
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

# 日志函数
log_with_timestamp() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log_alert() {
    echo -e "${RED}[ALERT $(date '+%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}[WARNING $(date '+%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

log_info() {
    echo -e "${GREEN}[INFO $(date '+%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

# 获取CPU使用率
get_cpu_usage() {
    top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}'
}

# 获取内存使用率
get_memory_usage() {
    free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}'
}

# 获取磁盘使用率
get_disk_usage() {
    df -h / | awk 'NR==2 {print $5}' | sed 's/%//'
}

# 获取负载平均值
get_load_average() {
    uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | sed 's/,//'
}

# 获取网络连接数
get_network_connections() {
    netstat -an | grep ESTABLISHED | wc -l
}

# 获取进程信息
get_top_processes() {
    echo "Top 5 CPU consuming processes:"
    ps aux --sort=-%cpu | head -6
    echo ""
    echo "Top 5 Memory consuming processes:"
    ps aux --sort=-%mem | head -6
}

# 检查Nginx状态
check_nginx_status() {
    if systemctl is-active --quiet nginx; then
        echo "Nginx: Running"
    else
        echo "Nginx: Stopped"
        log_alert "Nginx service is not running!"
    fi
}

# 检查磁盘空间
check_disk_space() {
    local usage=$(get_disk_usage)
    if [ "$usage" -gt "$ALERT_THRESHOLD_DISK" ]; then
        log_alert "Disk usage is ${usage}% (threshold: ${ALERT_THRESHOLD_DISK}%)"
    elif [ "$usage" -gt 75 ]; then
        log_warning "Disk usage is ${usage}%"
    fi
}

# 检查内存使用
check_memory_usage() {
    local usage=$(get_memory_usage)
    local usage_int=$(echo "$usage" | cut -d'.' -f1)
    if [ "$usage_int" -gt "$ALERT_THRESHOLD_MEM" ]; then
        log_alert "Memory usage is ${usage}% (threshold: ${ALERT_THRESHOLD_MEM}%)"
    elif [ "$usage_int" -gt 70 ]; then
        log_warning "Memory usage is ${usage}%"
    fi
}

# 检查CPU使用
check_cpu_usage() {
    local usage=$(get_cpu_usage)
    local usage_int=$(echo "$usage" | cut -d'.' -f1)
    if [ "$usage_int" -gt "$ALERT_THRESHOLD_CPU" ]; then
        log_alert "CPU usage is ${usage}% (threshold: ${ALERT_THRESHOLD_CPU}%)"
    elif [ "$usage_int" -gt 60 ]; then
        log_warning "CPU usage is ${usage}%"
    fi
}

# 清理系统缓存（谨慎使用）
clean_system_cache() {
    echo "Cleaning system cache..."
    sync
    echo 1 > /proc/sys/vm/drop_caches
    echo "System cache cleaned"
}

# 主监控函数
monitor_system() {
    echo "=== Server Performance Monitor ==="
    echo "Timestamp: $(date)"
    echo ""
    
    # 系统信息
    echo "=== System Information ==="
    echo "Uptime: $(uptime -p)"
    echo "Load Average: $(get_load_average)"
    echo "CPU Usage: $(get_cpu_usage)%"
    echo "Memory Usage: $(get_memory_usage)%"
    echo "Disk Usage: $(get_disk_usage)%"
    echo "Network Connections: $(get_network_connections)"
    echo ""
    
    # 服务状态
    echo "=== Service Status ==="
    check_nginx_status
    echo ""
    
    # 进程信息
    echo "=== Process Information ==="
    get_top_processes
    echo ""
    
    # 内存详情
    echo "=== Memory Details ==="
    free -h
    echo ""
    
    # 磁盘详情
    echo "=== Disk Usage ==="
    df -h
    echo ""
    
    # 检查阈值
    check_cpu_usage
    check_memory_usage
    check_disk_space
    
    echo "=== Monitor Complete ==="
    echo ""
}

# 快速状态检查
quick_status() {
    echo "CPU: $(get_cpu_usage)% | MEM: $(get_memory_usage)% | DISK: $(get_disk_usage)% | LOAD: $(get_load_average)"
}

# 帮助信息
show_help() {
    echo "Usage: $0 [option]"
    echo "Options:"
    echo "  monitor    - Full system monitoring (default)"
    echo "  quick      - Quick status check"
    echo "  clean      - Clean system cache (requires root)"
    echo "  help       - Show this help message"
}

# 主程序
case "${1:-monitor}" in
    "monitor")
        monitor_system
        ;;
    "quick")
        quick_status
        ;;
    "clean")
        if [ "$EUID" -ne 0 ]; then
            echo "Please run as root to clean system cache"
            exit 1
        fi
        clean_system_cache
        ;;
    "help")
        show_help
        ;;
    *)
        echo "Unknown option: $1"
        show_help
        exit 1
        ;;
esac