<template>
  <div id="app" :class="[themeClass]">
    <div class="app-container">
      <!-- 顶部导航 -->
      <HeaderNav />
      
      <!-- 主要内容区域 -->
      <div class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade-slide" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
      
      <!-- 底部 -->
      <FooterMain />
    </div>
    
    <!-- 回到顶部按钮 -->
    <BackToTop />
  </div>
</template>

<script setup lang="ts">
import { computed }

 from 'vue'
import { useAppStore } from '@/stores/app'
import HeaderNav from '@/components/layout/Header/HeaderNav.vue'
import FooterMain from '@/components/layout/Footer/FooterMain.vue'
import BackToTop from '@/components/common/BackToTop.vue'

const appStore = useAppStore()

const themeClass = computed(() => {
  return appStore.isDark ? 'theme-dark' : 'theme-light'
})
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--bg-color);
}

#app {
  min-height: 100vh;
  transition: all 0.3s ease;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 80px; // 为固定导航栏留出空间
}

// 页面切换动画
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

// 主题变量
.theme-light {
  --bg-color: #fff;
  --bg-secondary: #f8f9fa;
  --text-color: #2c3e50;
  --text-secondary: #6c757d;
  --border-color: #e9ecef;
  --primary-color: #007bff;
  --primary-hover: #0056b3;
  --shadow: 0 2px 12px rgb(0 0 0 / 10%);
}

.theme-dark {
  --bg-color: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --text-color: #fff;
  --text-secondary: #b0b0b0;
  --border-color: #404040;
  --primary-color: #409eff;
  --primary-hover: #66b1ff;
  --shadow: 0 2px 12px rgb(0 0 0 / 30%);
}
</style>