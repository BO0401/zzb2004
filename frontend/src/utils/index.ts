/**
 * 工具函数统一导出
 * 提供项目中所有通用工具函数的统一入口
 */

// 格式化工具
export {
  formatNumber,
  formatDate,
  formatRelativeTime,
  formatFileSize,
  formatPercentage
} from './format.js'

// 文本处理工具
export {
  getDifficultyText,
  getStatusText,
  truncateText,
  capitalize,
  camelToKebab,
  kebabToCamel,
  generateRandomString,
  highlightKeyword
} from './text.js'

// 验证工具
export {
  isEmail,
  isPhone,
  isUrl,
  isValidPassword,
  validateRequired,
  validateLength,
  validatePattern
} from './validation.js'

// 存储工具
export {
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  clearLocalStorage,
  setSessionStorage,
  getSessionStorage,
  removeSessionStorage,
  clearSessionStorage
} from './storage.js'

// DOM 工具
export {
  scrollToTop,
  scrollToElement,
  getScrollTop,
  debounce,
  throttle,
  copyToClipboard,
  downloadFile
} from './dom.js'