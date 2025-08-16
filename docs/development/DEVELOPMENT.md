# 项目开发日志

## 项目概述
本项目是一个个人博客系统，包含前端Vue应用和相关配置文件。

## 技术栈
- **前端**: Vue 3 + TypeScript + Vite
- **样式**: SCSS + Element Plus
- **路由**: Vue Router
- **状态管理**: Pinia

## 项目结构
```
blog-frontend/
├── src/
│   ├── components/     # 可复用组件
│   ├── views/         # 页面组件
│   ├── router/        # 路由配置
│   ├── stores/        # 状态管理
│   ├── styles/        # 样式文件
│   └── config/        # 配置文件
├── public/            # 静态资源
└── dist/             # 构建输出
```

## 开发记录

### 组件开发
- **Header/HeaderNav.vue** - 导航栏组件
- **Footer/FooterMain.vue** - 底部信息组件  
- **BackToTop.vue** - 返回顶部功能组件

### 页面开发
- **Home.vue** - 首页
- **About.vue** - 关于页面
- **Contact.vue** - 联系页面
- **Projects.vue** - 项目展示
- **Tutorials.vue** - 教程列表
- **404.vue** - 错误页面

### 配置管理
- 使用环境变量管理敏感信息
- 配置文件支持开发和生产环境

## 部署说明
- 参考 `/examples/deploy.example.sh`
- 配置 webhook 自动部署
- 环境变量配置参考 `config/.env.example`

## 安全措施
- 所有敏感信息使用环境变量
- 提供示例配置文件
- 详细安全指南见 `SECURITY.md`