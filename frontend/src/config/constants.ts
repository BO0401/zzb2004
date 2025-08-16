/**
 * 项目常量定义
 * 统一管理项目中使用的常量
 */

// API 相关常量
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  TIMEOUT: 10000,
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000
} as const

// 路由常量
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  TUTORIALS: '/tutorials',
  TUTORIAL_DETAIL: '/tutorials/:category/:id',
  PROJECTS: '/projects',
  PROJECT_DETAIL: '/projects/:id',
  NOT_FOUND: '/404'
} as const

// 存储键名常量
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
  TUTORIAL_PROGRESS: 'tutorial_progress',
  BOOKMARKS: 'bookmarks',
  RECENT_VIEWS: 'recent_views'
} as const

// 主题常量
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
} as const

// 语言常量
export const LANGUAGES = {
  ZH_CN: 'zh-CN',
  EN_US: 'en-US'
} as const

// 教程分类常量
export const TUTORIAL_CATEGORIES = {
  HTML: 'html',
  CSS: 'css',
  JAVASCRIPT: 'javascript',
  VUE: 'vue',
  REACT: 'react',
  NODE: 'node'
} as const

// 难度等级常量
export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
} as const

// 状态常量
export const STATUS = {
  PUBLISHED: 'published',
  DRAFT: 'draft',
  ARCHIVED: 'archived',
  PENDING: 'pending'
} as const

// 项目状态常量
export const PROJECT_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  PAUSED: 'paused',
  CANCELLED: 'cancelled'
} as const

// 文件类型常量
export const FILE_TYPES = {
  IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
  VIDEO: ['mp4', 'webm', 'ogg'],
  AUDIO: ['mp3', 'wav', 'ogg'],
  DOCUMENT: ['pdf', 'doc', 'docx', 'txt', 'md'],
  CODE: ['js', 'ts', 'vue', 'html', 'css', 'scss', 'json']
} as const

// 分页常量
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 10
} as const

// 动画持续时间常量
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
} as const

// 断点常量（响应式设计）
export const BREAKPOINTS = {
  XS: 0,
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  XXL: 1400
} as const

// 媒体查询常量
export const MEDIA_QUERIES = {
  XS: `(min-width: ${BREAKPOINTS.XS}px)`,
  SM: `(min-width: ${BREAKPOINTS.SM}px)`,
  MD: `(min-width: ${BREAKPOINTS.MD}px)`,
  LG: `(min-width: ${BREAKPOINTS.LG}px)`,
  XL: `(min-width: ${BREAKPOINTS.XL}px)`,
  XXL: `(min-width: ${BREAKPOINTS.XXL}px)`
} as const

// 正则表达式常量
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^1[3-9]\d{9}$/,
  URL: /^https?:\/\/.+/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  USERNAME: /^[a-zA-Z0-9_-]{3,16}$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/
} as const

// 错误代码常量
export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR'
} as const

// 事件名称常量
export const EVENTS = {
  THEME_CHANGED: 'theme:changed',
  LANGUAGE_CHANGED: 'language:changed',
  USER_LOGIN: 'user:login',
  USER_LOGOUT: 'user:logout',
  TUTORIAL_COMPLETED: 'tutorial:completed',
  PROJECT_UPDATED: 'project:updated'
} as const

// 默认值常量
export const DEFAULTS = {
  AVATAR: '/avatar.svg',
  COVER_IMAGE: '/logo.svg',
  PAGE_TITLE: '个人博客',
  META_DESCRIPTION: '分享前端技术与项目经验',
  AUTHOR: 'ZZB2004'
} as const

// 限制常量
export const LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_CONTENT_LENGTH: 50000,
  MAX_TAGS: 10,
  MAX_COMMENTS_PER_PAGE: 50
} as const

// 缓存时间常量（毫秒）
export const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000,      // 5分钟
  MEDIUM: 30 * 60 * 1000,    // 30分钟
  LONG: 24 * 60 * 60 * 1000, // 24小时
  WEEK: 7 * 24 * 60 * 60 * 1000 // 7天
} as const