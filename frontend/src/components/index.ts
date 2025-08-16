/**
 * 组件统一导出
 * 提供项目中所有组件的统一入口
 */

// 布局组件
export { default as HeaderNav } from './layout/Header/HeaderNav.vue'
export { default as FooterMain } from './layout/Footer/FooterMain.vue'

// 通用组件
export { default as BackToTop } from './common/BackToTop.vue'

// 组件类型定义
export interface ComponentProps {
  [key: string]: any
}

// 组件配置
export const COMPONENT_CONFIG = {
  // 回到顶部按钮配置
  backToTop: {
    threshold: 300, // 显示阈值
    duration: 300   // 滚动动画时长
  },
  
  // 头部导航配置
  header: {
    sticky: true,   // 是否固定
    transparent: false // 是否透明
  },
  
  // 底部配置
  footer: {
    showStatistics: true, // 是否显示统计信息
    showLinks: true       // 是否显示链接
  }
}