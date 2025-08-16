/**
 * 配置文件统一导出
 * 提供项目配置的统一入口
 */

// 导出主配置
export { default as config } from './config'
export { config as appConfig } from './config'

// 导出常量
export * from './constants'

// 导出类型定义
export interface AppConfig {
  site: {
    title: string
    author: string
    domain: string
    email: string
  }
  github: {
    username: string
    repo: string
    repoUrl: string
  }
  social: {
    github: string
    email: string
    blog: string
  }
  contact: {
    email: string
    wechat: string
    phone: string
  }
  assets: {
    avatar: string
    logo: string
  }
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  language: 'zh-CN' | 'en-US'
  fontSize: 'small' | 'medium' | 'large'
  autoSave: boolean
  notifications: boolean
}

export interface TutorialProgress {
  tutorialId: string
  progress: number
  completedAt?: Date

  notes?: string
}

export interface ProjectInfo {
  id: string
  name: string
  description: string
  status: 'active' | 'completed' | 'paused' | 'cancelled'
  technologies: string[]
  startDate: Date
  endDate?: Date
  repository?: string
  demo?: string
}

// 环境配置
export const isDevelopment = import.meta.env.DEV
export const isProduction = import.meta.env.PROD
export const isTest = import.meta.env.MODE === 'test'



// 功能开关
export const FEATURE_FLAGS = {
  enableDarkMode: import.meta.env.VITE_ENABLE_DARK_MODE !== 'false'
} as const