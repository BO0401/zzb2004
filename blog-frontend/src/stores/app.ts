import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 主题相关
  const isDark = ref(false)
  const theme = computed(() => isDark.value ? 'dark' : 'light')
  
  // 移动端检测
  const isMobile = ref(false)
  
  // 侧边栏状态
  const sidebarCollapsed = ref(false)
  
  // 网站配置
  const siteConfig = ref({
    title: 'ZZB2004',
    subtitle: '前端开发者的学习之路',
    description: '分享前端开发技术、项目经验和学习心得',
    author: 'ZZB2004',
    avatar: '/avatar.jpg',
    github: 'https://github.com/zzb2004',
    email: 'your-email@example.com'
  })
  
  // 统计数据
  const statistics = ref({
    tutorialCount: 0,
    projectCount: 0,
    viewCount: 0,
    visitCount: 0
  })
  
  // 切换主题
  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', theme.value)
  }
  
  // 初始化主题
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else {
      // 检测系统主题偏好
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
  }
  
  // 设置移动端状态
  const setMobile = (mobile: boolean) => {
    isMobile.value = mobile
  }
  
  // 切换侧边栏
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
  
  // 更新统计数据
  const updateStatistics = (data: Partial<typeof statistics.value>) => {
    statistics.value = { ...statistics.value, ...data }
  }
  
  return {
    // state
    isDark,
    theme,
    isMobile,
    sidebarCollapsed,
    siteConfig,
    statistics,
    
    // actions
    toggleTheme,
    initTheme,
    setMobile,
    toggleSidebar,
    updateStatistics
  }
})