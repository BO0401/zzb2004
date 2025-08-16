/**
 * DOM 操作工具函数
 * 统一管理 DOM 操作、事件处理等方法
 */

/**
 * 滚动到顶部
 * @param duration 动画持续时间（毫秒）
 */
export function scrollToTop(duration: number = 300): void {
  const startPosition = window.pageYOffset
  const startTime = performance.now()

  function animation(currentTime: number) {
    const timeElapsed = currentTime - startTime
    const progress = Math.min(timeElapsed / duration, 1)
    
    // 使用缓动函数
    const easeInOutQuad = progress < 0.5 
      ? 2 * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 2) / 2
    
    window.scrollTo(0, startPosition * (1 - easeInOutQuad))
    
    if (progress < 1) {
      requestAnimationFrame(animation)
    }
  }
  
  requestAnimationFrame(animation)
}

/**
 * 滚动到指定元素
 * @param element 目标元素或选择器
 * @param offset 偏移量
 * @param duration 动画持续时间
 */
export function scrollToElement(
  element: Element | string, 
  offset: number = 0, 
  duration: number = 300
): void {
  const targetElement = typeof element === 'string' 
    ? document.querySelector(element) 
    : element
    
  if (!targetElement) {
    console.warn('目标元素不存在')
    return
  }
  
  const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset + offset
  const startPosition = window.pageYOffset
  const distance = targetPosition - startPosition
  const startTime = performance.now()
  
  function animation(currentTime: number) {
    const timeElapsed = currentTime - startTime
    const progress = Math.min(timeElapsed / duration, 1)
    
    const easeInOutQuad = progress < 0.5 
      ? 2 * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 2) / 2
    
    window.scrollTo(0, startPosition + distance * easeInOutQuad)
    
    if (progress < 1) {
      requestAnimationFrame(animation)
    }
  }
  
  requestAnimationFrame(animation)
}

/**
 * 获取滚动距离
 * @returns 滚动距离
 */
export function getScrollTop(): number {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
}

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param wait 等待时间
 * @param immediate 是否立即执行
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    
    const callNow = immediate && !timeout
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    
    if (callNow) func(...args)
  }
}

/**
 * 节流函数
 * @param func 要节流的函数
 * @param limit 时间间隔
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @returns 是否复制成功
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // 降级方案
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      const success = document.execCommand('copy')
      document.body.removeChild(textArea)
      return success
    }
  } catch (error) {
    console.error('复制失败:', error)
    return false
  }
}

/**
 * 下载文件
 * @param url 文件URL
 * @param filename 文件名
 */
export function downloadFile(url: string, filename?: string): void {
  const link = document.createElement('a')
  link.href = url
  if (filename) {
    link.download = filename
  }
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * 获取元素的可视区域位置
 * @param element 目标元素
 * @returns 位置信息
 */
export function getElementViewportPosition(element: Element) {
  const rect = element.getBoundingClientRect()
  const windowHeight = window.innerHeight || document.documentElement.clientHeight
  const windowWidth = window.innerWidth || document.documentElement.clientWidth
  
  return {
    top: rect.top,
    left: rect.left,
    bottom: rect.bottom,
    right: rect.right,
    width: rect.width,
    height: rect.height,
    isInViewport: rect.top >= 0 && rect.left >= 0 && rect.bottom <= windowHeight && rect.right <= windowWidth,
    isPartiallyInViewport: rect.top < windowHeight && rect.bottom > 0 && rect.left < windowWidth && rect.right > 0
  }
}