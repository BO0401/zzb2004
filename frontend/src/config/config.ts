// 配置文件 - 使用环境变量管理敏感信息

// 从环境变量获取配置，如果没有则使用默认值
export const config = {
  // 网站基本信息
  site: {
    title: import.meta.env.VITE_SITE_TITLE || '个人博客',
    author: import.meta.env.VITE_SITE_AUTHOR || '博主',
    domain: import.meta.env.VITE_SITE_DOMAIN || '',
  email: import.meta.env.VITE_SITE_EMAIL || ''
  },

  // GitHub 配置
  github: {
    username: import.meta.env.VITE_GITHUB_USERNAME || 'username',
    repo: import.meta.env.VITE_GITHUB_REPO || 'repo',
    repoUrl: import.meta.env.VITE_GITHUB_REPO_URL || 'https://github.com/username/repo'
  },

  // 社交媒体链接
  social: {
    github: import.meta.env.VITE_SOCIAL_GITHUB || 'https://github.com/username',
    email: import.meta.env.VITE_SOCIAL_EMAIL || '',
  blog: import.meta.env.VITE_SOCIAL_BLOG || ''
  },

  // 联系方式
  contact: {
    email: import.meta.env.VITE_CONTACT_EMAIL || '',
    wechat: import.meta.env.VITE_CONTACT_WECHAT || 'wechat-id',
    phone: import.meta.env.VITE_CONTACT_PHONE || '+86-xxx-xxxx-xxxx'
  },

  // 资源路径
  assets: {
    avatar: import.meta.env.VITE_AVATAR_URL || '/avatar.svg',
    logo: import.meta.env.VITE_LOGO_URL || '/logo.svg'
  }
};

// 开发环境下的默认配置
if (import.meta.env.DEV) {
  // 生产环境避免输出敏感配置
}

export default config;