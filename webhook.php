<?php
/**
 * zzb2004.xyz 个人博客 GitHub Webhook 自动部署处理脚本
 * 作者: bo天天开心
 * 邮箱: 2080083393@qq.com
 * 域名: zzb2004.xyz
 * 仓库: https://github.com/BO0401/zzb2004.git
 * 更新时间: 2024
 */

// 设置响应头
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// 配置信息
$config = [
    'secret' => 'zVXa9kF5Zq7tRwYb2Op6sN0lMv3eJiKxHc4Lp1TzUyGd',
    'website_root' => '/www/wwwroot/zzb2004.xyz',
    'project_dir' => '/www/wwwroot/zzb2004.xyz/zzb2004',
    'deploy_script' => '/www/wwwroot/zzb2004.xyz/zzb2004/deploy.sh',
    'webhook_log' => '/www/wwwroot/zzb2004.xyz/webhook.log',
    'deploy_log' => '/www/wwwroot/zzb2004.xyz/zzb2004/deploy.log'
];

// 日志记录函数
function writeLog($message, $logFile) {
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[$timestamp] $message\n";
    file_put_contents($logFile, $logMessage, FILE_APPEND | LOCK_EX);
}

// 错误处理函数
function sendError($code, $message) {
    global $config;
    http_response_code($code);
    $error = [
        'status' => 'error',
        'code' => $code,
        'message' => $message,
        'timestamp' => date('Y-m-d H:i:s')
    ];
    writeLog("错误: $message (HTTP $code)", $config['webhook_log']);
    echo json_encode($error, JSON_UNESCAPED_UNICODE);
    exit;
}

// 获取请求体和头信息
$payload = file_get_contents('php://input');
$headers = getallheaders();

// 记录请求信息
writeLog("收到Webhook请求 - IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'), $config['webhook_log']);

// 验证签名头是否存在
if (!isset($headers['X-Hub-Signature-256'])) {
    sendError(403, '缺少签名头信息');
}

// 验证签名
$signature = hash_hmac('sha256', $payload, $config['secret']);
$expected_signature = 'sha256=' . $signature;

if (!hash_equals($expected_signature, $headers['X-Hub-Signature-256'])) {
    sendError(403, '签名验证失败');
}

// 解析JSON数据
$data = json_decode($payload, true);
if (!$data) {
    sendError(400, '无效的JSON数据');
}

// 检查是否是main分支的push事件
if (!isset($data['ref']) || $data['ref'] !== 'refs/heads/main') {
    $response = [
        'status' => 'ignored',
        'message' => '非main分支推送，忽略此次请求',
        'ref' => $data['ref'] ?? 'unknown',
        'timestamp' => date('Y-m-d H:i:s')
    ];
    writeLog("忽略推送: " . ($data['ref'] ?? 'unknown'), $config['webhook_log']);
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit;
}

// 获取推送信息
$pusher = $data['pusher']['name'] ?? 'unknown';
$commit_id = substr($data['after'] ?? '', 0, 7);
$commit_message = $data['head_commit']['message'] ?? 'No message';
$commit_url = $data['head_commit']['url'] ?? '';

// 记录详细的推送信息
$pushInfo = "main分支推送触发 - 推送者: $pusher, 提交: $commit_id, 消息: $commit_message";
writeLog($pushInfo, $config['webhook_log']);

// 检查部署脚本是否存在
if (!file_exists($config['deploy_script'])) {
    sendError(500, '部署脚本不存在: ' . $config['deploy_script']);
}

// 检查部署脚本是否可执行
if (!is_executable($config['deploy_script'])) {
    sendError(500, '部署脚本没有执行权限');
}
// 记录部署开始
writeLog("开始执行自动部署 - 提交: $commit_id", $config['webhook_log']);

// 异步执行部署脚本
$deploy_command = "bash {$config['deploy_script']} >> {$config['deploy_log']} 2>&1 &";
$output = [];
$return_code = 0;

// 执行部署命令
exec($deploy_command, $output, $return_code);

// 构建成功响应
$response = [
    'status' => 'success',
    'message' => '自动部署已触发',
    'data' => [
        'pusher' => $pusher,
        'commit_id' => $commit_id,
        'commit_message' => $commit_message,
        'commit_url' => $commit_url,
        'deploy_command' => $deploy_command,
        'website_url' => 'https://zzb2004.xyz'
    ],
    'timestamp' => date('Y-m-d H:i:s'),
    'server_info' => [
        'php_version' => PHP_VERSION,
        'server_time' => date('Y-m-d H:i:s'),
        'deploy_log' => $config['deploy_log']
    ]
];

// 记录部署触发成功
writeLog("部署脚本已触发 - 推送者: $pusher, 提交: $commit_id", $config['webhook_log']);

// 返回JSON响应
echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

// 记录响应完成
writeLog("Webhook处理完成", $config['webhook_log']);
?>