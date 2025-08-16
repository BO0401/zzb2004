/**
 * 服务层统一导出
 * 提供项目中所有服务的统一入口
 */



// 导出教程服务
export * from './tutorialService'

// 导出类型定义






// 服务工厂
export class ServiceFactory {
  private static services = new Map<string, any>()

  /**
   * 注册服务
   */
  static register<T>(name: string, service: T): void {
    this.services.set(name, service)
  }

  /**
   * 获取服务
   */
  static get<T>(name: string): T {
    const service = this.services.get(name)
    if (!service) {
      throw new Error(`Service '${name}' not found`)
    }
    return service
  }

  /**
   * 检查服务是否存在
   */
  static has(name: string): boolean {
    return this.services.has(name)
  }

  /**
   * 移除服务
   */
  static remove(name: string): boolean {
    return this.services.delete(name)
  }

  /**
   * 清空所有服务
   */
  static clear(): void {
    this.services.clear()
  }

  /**
   * 获取所有服务名称
   */
  static getServiceNames(): string[] {
    return Array.from(this.services.keys())
  }
}

// 缓存服务
export class CacheService {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

  /**
   * 设置缓存
   */
  set(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  /**
   * 获取缓存
   */
  get<T = any>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) {
      return null
    }

    // 检查是否过期
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  /**
   * 删除缓存
   */
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  /**
   * 清空缓存
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * 检查缓存是否存在且未过期
   */
  has(key: string): boolean {
    return this.get(key) !== null
  }

  /**
   * 获取缓存大小
   */
  size(): number {
    return this.cache.size
  }

  /**
   * 清理过期缓存
   */
  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

// 创建缓存服务实例
export const cacheService = new CacheService()

// 定期清理过期缓存
setInterval(() => {
  cacheService.cleanup()
}, 5 * 60 * 1000) // 每5分钟清理一次

// 事件服务
export class EventService {
  private listeners = new Map<string, Set<Function>>()

  /**
   * 监听事件
   */
  on(event: string, callback: Function): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    
    this.listeners.get(event)!.add(callback)
    
    // 返回取消监听的函数
    return () => this.off(event, callback)
  }

  /**
   * 监听一次事件
   */
  once(event: string, callback: Function): () => void {
    const wrapper = (...args: any[]) => {
      callback(...args)
      this.off(event, wrapper)
    }
    
    return this.on(event, wrapper)
  }

  /**
   * 取消监听
   */
  off(event: string, callback: Function): void {
    const listeners = this.listeners.get(event)
    if (listeners) {
      listeners.delete(callback)
      if (listeners.size === 0) {
        this.listeners.delete(event)
      }
    }
  }

  /**
   * 触发事件
   */
  emit(event: string, ...args: any[]): void {
    const listeners = this.listeners.get(event)
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(...args)
        } catch (error) {
          console.error(`Error in event listener for '${event}':`, error)
        }
      })
    }
  }

  /**
   * 移除所有监听器
   */
  removeAllListeners(event?: string): void {
    if (event) {
      this.listeners.delete(event)
    } else {
      this.listeners.clear()
    }
  }

  /**
   * 获取事件监听器数量
   */
  listenerCount(event: string): number {
    return this.listeners.get(event)?.size || 0
  }

  /**
   * 获取所有事件名称
   */
  eventNames(): string[] {
    return Array.from(this.listeners.keys())
  }
}

// 创建事件服务实例
export const eventService = new EventService()