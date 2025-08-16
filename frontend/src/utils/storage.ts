/**
 * 存储工具函数
 * 统一管理 localStorage 和 sessionStorage 操作
 */

















/**
 * 检查存储是否可用
 * @param type 存储类型
 * @returns 是否可用
 */
export function isStorageAvailable(type: 'localStorage' | 'sessionStorage'): boolean {
  try {
    const storage = window[type]
    const testKey = '__storage_test__'
    storage.setItem(testKey, 'test')
    storage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}