#!/bin/bash
# 自动部署脚本
# 域名: zzb2004.xyz

echo "开始部署: $(date)"

# 进入网站根目录
cd /www/wwwroot/zzb2004.xyz

# 拉取最新代码
echo "正在拉取最新代码..."
git pull origin main

if [ $? -ne 0 ]; then
    echo "Git拉取失败!"
    exit 1
fi

# 进入前端目录
cd blog-frontend

# 安装依赖
echo "正在安装依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "依赖安装失败!"
    exit 1
fi

# 构建项目
echo "正在构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "项目构建失败!"
    exit 1
fi

# 复制构建文件到网站根目录
echo "正在部署文件..."
cp -r dist/* ../

# 设置文件权限
chmod -R 755 ../

echo "部署完成: $(date)"
echo "网站地址: https://zzb2004.xyz"