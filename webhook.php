<?php
/**
 * GitHub Webhook 自动部署处理脚本
 * 域名: zzb2004.xyz
 * 仓库: https://github.com/BO0401/zzb2004.git
 */

// 设置响应头
header('Content-Type: application/json');

// GitHub Webhook 密钥
$secret = 'zVXa9kF5Zq7tRwYb2Op6sN0lMv3eJiKxHc4Lp1TzUyGd';

// 获取请求体
$payload = file_get_contents('php://input');
$headers = getallheaders();

// 验证签名
if (!isset($headers['X-Hub-Signature-256'])) {
    http_response_code(403);
    echo json_encode(['error' => 'Missing signature header']);
    exit;
}

$signature = hash_hmac('sha256', $payload, $secret);
$expected_signature = 'sha256=' . $signature;

if (!hash_equals($expected_signature, $headers['X-Hub-Signature-256'])) {
    http_response_code(403);
    echo json_encode(['error' => 'Invalid signature']);
    exit;
}

// 解析payload
$data = json_decode($payload, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON payload']);
    exit;
}

// 检查是否是main分支的push事件
if (isset($data['ref']) && $data['ref'] === 'refs/heads/main') {
    // 记录日志
    $log_message = date('Y-m-d H:i:s') . " - Webhook triggered by: " . $data['pusher']['name'] . "\n";
    file_put_contents('/www/wwwroot/zzb2004.xyz/webhook.log', $log_message, FILE_APPEND);
    
    // 执行部署脚本
    $deploy_script = '/www/wwwroot/zzb2004.xyz/deploy.sh';
    $output = [];
    $return_code = 0;
    
    // 异步执行部署脚本
    exec("bash $deploy_script > /www/wwwroot/zzb2004.xyz/deploy.log 2>&1 &", $output, $return_code);
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Deployment triggered',
        'timestamp' => date('Y-m-d H:i:s'),
        'commit' => substr($data['after'], 0, 7)
    ]);
} else {
    echo json_encode([
        'status' => 'ignored',
        'message' => 'Not a main branch push event'
    ]);
}
?>