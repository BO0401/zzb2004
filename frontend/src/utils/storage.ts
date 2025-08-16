/**
 * 存储工具函数
 * 统一管理 localStorage 和 sessionStorage 操作
 */

/**
 * 设置 localStorage
 * @param key 键名
 * @param value 值
 */
export function setLocalStorage(key: string, value: any): void {
  try {
    const serializedValue = JSON.stringify(value)
    localStorage.setItem(key, serializedValue)
  } catch (error) {
    console.error('设置 localStorage 失败:', error)
  }
}

/**
 * 获取 localStorage
 * @param key 键名
 * @param defaultValue 默认值
 * @returns 存储的值或默认值
 */
export function getLocalStorage<T>(key: string, defaultValue?: T): T | null {
  try {
    const item = localStorage.getItem(key)
    if (item === null) {
      return defaultValue || null
    }
    return JSON.parse(item)
  } catch (error) {
    console.error('获取 localStorage 失败:', error)
    return defaultValue || null
  }
}

/**
 * 删除 localStorage
 * @param key 键名
 */
export function removeLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('删除 localStorage 失败:', error)
  }
}

/**
 * 清空 localStorage
 */
export function clearLocalStorage(): void {
  try {
    localStorage.clear()
  } catch (error) {
    console.error('清空 localStorage 失败:', error)
  }
}

/**
 * 设置 sessionStorage
 * @param key 键名
 * @param value 值
 */
export function setSessionStorage(key: string, value: any): void {
  try {
    const serializedValue = JSON.stringify(value)
    sessionStorage.setItem(key, serializedValue)
  } catch (error) {
    console.error('设置 sessionStorage 失败:', error)
  }
}

/**
 * 获取 sessionStorage
 * @param key 键名
 * @param defaultValue 默认值
 * @returns 存储的值或默认值
 */
export function getSessionStorage<T>(key: string, defaultValue?: T): T | null {
  try {
    const item = sessionStorage.getItem(key)
    if (item === null) {
      return defaultValue || null
    }
    return JSON.parse(item)
  } catch (error) {
    console.error('获取 sessionStorage 失败:', error)
    return defaultValue || null
  }
}

/**
 * 删除 sessionStorage
 * @param key 键名
 */
export function removeSessionStorage(key: string): void {
  try {
    sessionStorage.removeItem(key)
  } catch (error) {
    console.error('删除 sessionStorage 失败:', error)
  }
}

/**
 * 清空 sessionStorage
 */
export function clearSessionStorage(): void {
  try {
    sessionStorage.clear()
  } catch (error) {
    console.error('清空 sessionStorage 失败:', error)
  }
}

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