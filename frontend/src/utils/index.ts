/**
 * 工具函数统一导出
 * 提供项目中所有通用工具函数的统一入口
 */

// 格式化工具
export {
  formatNumber,
  formatDate
} from './format.js'

// 文本处理工具
export {
  getDifficultyText,
  getStatusText
} from './text.js'

// DOM 工具
export {
  scrollToTop
} from './dom.js'