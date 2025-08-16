/**
 * 格式化工具函数
 * 统一管理数字、日期、文本等格式化方法
 */

/**
 * 格式化数字显示
 * @param num 数字
 * @returns 格式化后的字符串
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

/**
 * 格式化日期显示
 * @param date 日期对象或字符串
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}