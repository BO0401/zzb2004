<?php
/**
 * GitHub Webhook 处理脚本模板
 * 复制此文件为 webhook.php 并配置相应的环境变量
 */

// 错误报告设置
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// 设置响应头
header('Content-Type: application/json; charset=utf-8');
header('X-Powered-By: Custom-Webhook-Handler');

// 配置信息 - 请根据实际情况修改
$config = [
    'secret' => getenv('WEBHOOK_SECRET') ?: 'your-webhook-secret-here',
    'website_root' => getenv('WEBSITE_ROOT') ?: '/www/wwwroot/yourdomain.com',
    'project_dir' => getenv('PROJECT_DIR') ?: '/www/wwwroot/yourdomain.com/project',
    'deploy_script' => getenv('DEPLOY_SCRIPT') ?: '/www/wwwroot/yourdomain.com/project/deploy.sh',
    'webhook_log' => getenv('WEBHOOK_LOG') ?: '/www/wwwroot/yourdomain.com/webhook.log',
    'deploy_log' => getenv('DEPLOY_LOG') ?: '/www/wwwroot/yourdomain.com/project/deploy.log',
    'allowed_branch' => 'main'
];

/**
 * 记录日志
 */
function writeLog($message, $logFile) {
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[{$timestamp}] {$message}" . PHP_EOL;
    file_put_contents($logFile, $logMessage, FILE_APPEND | LOCK_EX);
}

/**
 * 验证 GitHub Webhook 签名
 */
function verifySignature($payload, $signature, $secret) {
    if (empty($signature)) {
        return false;
    }
    
    $expectedSignature = 'sha256=' . hash_hmac('sha256', $payload, $secret);
    return hash_equals($expectedSignature, $signature);
}

/**
 * 发送错误响应
 */
function sendErrorResponse($message, $code = 400) {
    global $config;
    http_response_code($code);
    writeLog("ERROR: {$message}", $config['webhook_log']);
    echo json_encode([
        'success' => false,
        'message' => $message,
        'timestamp' => date('c')
    ]);
    exit;
}

try {
    // 获取请求数据
    $payload = file_get_contents('php://input');
    $signature = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';
    
    writeLog("收到 Webhook 请求，来源 IP: {$_SERVER['REMOTE_ADDR']}", $config['webhook_log']);
    
    // 验证签名
    if (!verifySignature($payload, $signature, $config['secret'])) {
        sendErrorResponse('签名验证失败', 401);
    }
    
    // 解析 JSON 数据
    $data = json_decode($payload, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        sendErrorResponse('JSON 解析失败');
    }
    
    // 检查是否为推送事件
    if (!isset($_SERVER['HTTP_X_GITHUB_EVENT']) || $_SERVER['HTTP_X_GITHUB_EVENT'] !== 'push') {
        writeLog("忽略非推送事件: {$_SERVER['HTTP_X_GITHUB_EVENT']}", $config['webhook_log']);
        echo json_encode([
            'success' => true,
            'message' => '事件已忽略',
            'event' => $_SERVER['HTTP_X_GITHUB_EVENT']
        ]);
        exit;
    }
    
    // 检查分支
    $branch = basename($data['ref'] ?? '');
    if ($branch !== $config['allowed_branch']) {
        writeLog("忽略非主分支推送: {$branch}", $config['webhook_log']);
        echo json_encode([
            'success' => true,
            'message' => '分支已忽略',
            'branch' => $branch
        ]);
        exit;
    }
    
    // 记录部署开始
    $deployId = uniqid('deploy_');
    writeLog("开始部署 [{$deployId}] - 分支: {$branch}", $config['webhook_log']);
    
    // 异步执行部署脚本
    $command = "cd {$config['project_dir']} && bash {$config['deploy_script']} > {$config['deploy_log']} 2>&1 &";
    exec($command);
    
    writeLog("部署脚本已启动 [{$deployId}]", $config['webhook_log']);
    
    // 返回成功响应
    echo json_encode([
        'success' => true,
        'message' => '部署已触发',
        'deploy_id' => $deployId,
        'branch' => $branch,
        'timestamp' => date('c'),
        'server' => gethostname()
    ]);
    
} catch (Exception $e) {
    sendErrorResponse('服务器内部错误: ' . $e->getMessage(), 500);
}
?>