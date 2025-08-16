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