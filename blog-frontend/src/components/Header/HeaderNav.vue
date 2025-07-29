<template>
  <header class="header-nav" :class="{ 'header-scrolled': isScrolled }">
    <div class="nav-container">
      <!-- Logo区域 -->
      <div class="nav-brand">
        <router-link to="/" class="brand-link">
          <img src="/logo.svg" alt="ZZB2004" class="brand-logo" v-if="false" />
          <span class="brand-text">ZZB2004</span>
        </router-link>
      </div>
      
      <!-- 导航菜单 -->
      <nav class="nav-menu" :class="{ 'nav-menu-open': mobileMenuOpen }">
        <ul class="nav-list">
          <li class="nav-item">
            <router-link to="/" class="nav-link" @click="closeMobileMenu">
              <el-icon><House /></el-icon>
              <span>首页</span>
            </router-link>
          </li>
          <li class="nav-item dropdown">
            <a href="#" class="nav-link dropdown-toggle" @click.prevent="toggleDropdown('tutorials')">
              <el-icon><Document /></el-icon>
              <span>前端教程</span>
              <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
            </a>
            <ul class="dropdown-menu" :class="{ 'dropdown-open': dropdowns.tutorials }">
              <li><router-link to="/tutorials/html" @click="closeMobileMenu">HTML教程</router-link></li>
              <li><router-link to="/tutorials/css" @click="closeMobileMenu">CSS教程</router-link></li>
              <li><router-link to="/tutorials/javascript" @click="closeMobileMenu">JavaScript教程</router-link></li>
              <li><router-link to="/tutorials/vue" @click="closeMobileMenu">Vue教程</router-link></li>
            </ul>
          </li>
          <li class="nav-item">
            <router-link to="/projects" class="nav-link" @click="closeMobileMenu">
              <el-icon><Folder /></el-icon>
              <span>项目展示</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/about" class="nav-link" @click="closeMobileMenu">
              <el-icon><User /></el-icon>
              <span>关于我</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/contact" class="nav-link" @click="closeMobileMenu">
              <el-icon><Message /></el-icon>
              <span>联系我</span>
            </router-link>
          </li>
        </ul>
      </nav>
      
      <!-- 右侧工具栏 -->
      <div class="nav-tools">
        <!-- 主题切换 -->
        <button class="tool-btn theme-toggle" @click="toggleTheme" :title="isDark ? '切换到亮色模式' : '切换到暗色模式'">
          <el-icon v-if="isDark"><Sunny /></el-icon>
          <el-icon v-else><Moon /></el-icon>
        </button>
        
        <!-- GitHub链接 -->
        <a href="https://github.com/zzb2004" target="_blank" class="tool-btn github-link" title="访问GitHub">
          <svg class="github-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
        
        <!-- 移动端菜单按钮 -->
        <button class="tool-btn mobile-menu-btn" @click="toggleMobileMenu" v-if="isMobile">
          <el-icon v-if="!mobileMenuOpen"><Menu /></el-icon>
          <el-icon v-else><Close /></el-icon>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, reactive }

 from 'vue'
import { useAppStore }

 from '@/stores/app'
import {
  House, Document, Folder, User, Message,
  Sunny, Moon, Menu, Close, ArrowDown
} from '@element-plus/icons-vue'

const appStore = useAppStore()

const isScrolled = ref(false)
const mobileMenuOpen = ref(false)
const dropdowns = reactive({
  tutorials: false
})

const isDark = computed(() => appStore.isDark)
const isMobile = computed(() => appStore.isMobile)

// 滚动监听
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

// 切换主题
const toggleTheme = () => {
  appStore.toggleTheme()
}

// 切换移动端菜单
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// 关闭移动端菜单
const closeMobileMenu = () => {
  mobileMenuOpen.value = false
  // 关闭所有下拉菜单
  Object.keys(dropdowns).forEach(key => {
    dropdowns[key as keyof typeof dropdowns] = false
  })
}

// 切换下拉菜单
const toggleDropdown = (key: keyof typeof dropdowns) => {
  dropdowns[key] = !dropdowns[key]
}

// 检测移动端
const checkMobile = () => {
  appStore.setMobile(window.innerWidth <= 768)
}

// 窗口大小变化监听
const handleResize = () => {
  checkMobile()
  if (!appStore.isMobile) {
    mobileMenuOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', handleResize)
  checkMobile()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped>
.header-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgb(255 255 255 / 95%);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s ease;
  
  &.header-scrolled {
    background: rgb(255 255 255 / 98%);
    box-shadow: var(--shadow);
  }
  
  .theme-dark & {
    background: rgb(26 26 26 / 95%);
    
    &.header-scrolled {
      background: rgb(26 26 26 / 98%);
    }
  }
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.nav-brand {
  .brand-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: var(--text-color);
    font-weight: bold;
    font-size: 1.5rem;
    
    .brand-logo {
      width: 32px;
      height: 32px;
      margin-right: 8px;
    }
    
    .brand-text {
      background: linear-gradient(45deg, var(--primary-color), #ff6b6b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
}

.nav-menu {
  @media (width <= 768px) {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: var(--bg-color);
    border-top: 1px solid var(--border-color);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    
    &.nav-menu-open {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }
  }
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  
  @media (width <= 768px) {
    flex-direction: column;
    padding: 20px;
  }
}

.nav-item {
  position: relative;
  
  &.dropdown:hover .dropdown-menu {
    @media (width >= 769px) {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
  }
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.3s ease;
  
  .el-icon {
    margin-right: 6px;
    font-size: 16px;
  }
  
  &:hover {
    color: var(--primary-color);
    background: var(--bg-secondary);
  }
  
  &.router-link-active {
    color: var(--primary-color);
  }
  
  @media (width <= 768px) {
    padding: 12px 0;
    border-bottom: 1px solid var(--border-color);
    border-radius: 0;
  }
}

.dropdown-toggle {
  .dropdown-icon {
    margin-left: 4px;
    margin-right: 0;
    transition: transform 0.3s ease;
  }
  
  .dropdown-open & .dropdown-icon {
    transform: rotate(180deg);
  }
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 160px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  box-shadow: var(--shadow);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  list-style: none;
  padding: 8px 0;
  margin: 0;
  
  @media (width <= 768px) {
    position: static;
    opacity: 1;
    visibility: visible;
    transform: none;
    box-shadow: none;
    border: none;
    background: transparent;
    padding-left: 20px;
    
    &:not(.dropdown-open) {
      display: none;
    }
    
    &.dropdown-open {
      display: block;
    }
  }
  
  li {
    a {
      display: block;
      padding: 8px 16px;
      color: var(--text-color);
      text-decoration: none;
      transition: all 0.3s ease;
      
      &:hover {
        background: var(--bg-secondary);
        color: var(--primary-color);
      }
    }
  }
}

.nav-tools {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tool-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: var(--text-color);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--bg-secondary);
    color: var(--primary-color);
  }
  
  .el-icon {
    font-size: 18px;
  }
}

.github-icon {
  width: 20px;
  height: 20px;
}

.mobile-menu-btn {
  @media (width >= 769px) {
    display: none;
  }
}
</style>