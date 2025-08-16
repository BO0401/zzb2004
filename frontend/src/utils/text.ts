/**
 * 文本处理工具函数
 * 统一管理状态文本、难度等级等文本转换方法
 */

/**
 * 难度等级映射
 */
const DIFFICULTY_MAP: Record<string, string> = {
  'beginner': '入门',
  'intermediate': '中级',
  'advanced': '高级'
}

/**
 * 状态映射
 */
const STATUS_MAP: Record<string, string> = {
  'published': '已发布',
  'draft': '草稿',
  'archived': '已归档',
  'pending': '待审核',
  'active': '进行中',
  'completed': '已完成',
  'paused': '已暂停',
  'cancelled': '已取消'
}

/**
 * 获取难度等级文本
 * @param difficulty 难度等级
 * @returns 中文难度文本
 */
export function getDifficultyText(difficulty: string): string {
  return DIFFICULTY_MAP[difficulty] || difficulty
}

/**
 * 获取状态文本
 * @param status 状态
 * @returns 中文状态文本
 */
export function getStatusText(status: string): string {
  return STATUS_MAP[status] || status
}

/**
 * 截断文本
 * @param text 原文本
 * @param maxLength 最大长度
 * @param suffix 后缀
 * @returns 截断后的文本
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) {
    return text
  }
  return text.slice(0, maxLength - suffix.length) + suffix
}

/**
 * 首字母大写
 * @param str 字符串
 * @returns 首字母大写的字符串
 */
export function capitalize(str: string): string {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 驼峰转短横线
 * @param str 驼峰字符串
 * @returns 短横线分隔的字符串
 */
export function camelToKebab(str: string): string {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

/**
 * 短横线转驼峰
 * @param str 短横线分隔的字符串
 * @returns 驼峰字符串
 */
export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * 生成随机字符串
 * @param length 长度
 * @returns 随机字符串
 */
export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 高亮搜索关键词
 * @param text 原文本
 * @param keyword 关键词
 * @param className 高亮样式类名
 * @returns 包含高亮标签的HTML字符串
 */
export function highlightKeyword(text: string, keyword: string, className: string = 'highlight'): string {
  if (!keyword) return text
  const regex = new RegExp(`(${keyword})`, 'gi')
  return text.replace(regex, `<span class="${className}">$1</span>`)
}