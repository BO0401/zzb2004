# 安全配置指南

## 概述

本项目包含敏感信息保护机制，确保个人信息和配置不会意外泄露到公共仓库。

## 敏感信息保护

### 已保护的文件类型

- 环境变量文件 (`.env*`)
- 部署脚本 (`deploy.sh`)
- Webhook 处理脚本 (`webhook.php`)
- 个人配置文件
- 密钥和证书文件
- 日志文件

### 配置步骤

#### 1. 环境变量配置

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，填入真实配置
vim .env
```

在 `.env` 文件中配置以下信息：

```env
# 网站基本信息
SITE_TITLE=你的博客标题
SITE_AUTHOR=你的真实姓名
SITE_DOMAIN=yourdomain.com
SITE_EMAIL=your-real-email@example.com

# GitHub 配置
GITHUB_USERNAME=your-github-username
GITHUB_REPO=your-repo-name
GITHUB_REPO_URL=https://github.com/your-username/your-repo

# Webhook 配置
WEBHOOK_SECRET=your-strong-secret-key

# 其他配置...
```

#### 2. 部署脚本配置

```bash
# 复制部署脚本模板
cp deploy.example.sh deploy.sh

# 设置执行权限
chmod +x deploy.sh

# 编辑部署脚本，修改路径配置
vim deploy.sh
```

#### 3. Webhook 脚本配置

```bash
# 复制 Webhook 脚本模板
cp webhook.example.php webhook.php

# 编辑 Webhook 脚本，配置密钥和路径
vim webhook.php
```

## 服务器环境变量设置

在服务器上设置环境变量：

```bash
# 在 /etc/environment 或 ~/.bashrc 中添加
export WEBHOOK_SECRET="your-webhook-secret"
export WEBSITE_ROOT="/www/wwwroot/yourdomain.com"
export PROJECT_DIR="/www/wwwroot/yourdomain.com/project"
# ... 其他变量
```

## 安全检查清单

### 开发环境

- [ ] `.env` 文件已创建并配置
- [ ] `.env` 文件已被 `.gitignore` 忽略
- [ ] 所有硬编码的敏感信息已替换为环境变量
- [ ] 模板文件不包含真实的敏感信息

### 生产环境

- [ ] 服务器环境变量已正确设置
- [ ] `deploy.sh` 脚本权限设置为 700
- [ ] `webhook.php` 脚本权限设置为 644
- [ ] Webhook 密钥足够强壮（建议 32+ 字符）
- [ ] 日志文件权限设置正确

### Git 仓库

- [ ] 敏感文件已从 Git 历史中移除
- [ ] `.gitignore` 文件已更新
- [ ] 仓库设置为私有（如果包含敏感信息）

## 紧急响应

### 如果敏感信息已泄露

1. **立即更改所有相关密码和密钥**
2. **撤销 GitHub Personal Access Token**
3. **更新 Webhook 密钥**
4. **检查服务器访问日志**
5. **考虑重新生成 SSH 密钥**

### 清理 Git 历史

如果敏感信息已提交到 Git：

```bash
# 使用 git filter-branch 清理历史（危险操作）
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch deploy.sh webhook.php' \
  --prune-empty --tag-name-filter cat -- --all

# 强制推送（会重写历史）
git push origin --force --all
git push origin --force --tags
```

**警告：** 这会重写 Git 历史，请谨慎操作！

## 最佳实践

1. **定期轮换密钥和密码**
2. **使用强密码生成器**
3. **启用双因素认证**
4. **定期审查访问权限**
5. **监控异常访问**
6. **备份重要配置**
7. **使用专用的部署用户**
8. **限制文件权限**

## 联系方式

如果发现安全问题，请通过以下方式联系：

- 创建私有 Issue
- 发送邮件到配置的安全邮箱
- 使用 GitHub Security Advisory

---

**重要提醒：** 永远不要在公共仓库中提交包含真实敏感信息的文件！