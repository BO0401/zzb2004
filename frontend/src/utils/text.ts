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