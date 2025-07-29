<template>
  <transition name="fade">
    <div 
      v-show="visible" 
      class="back-to-top" 
      @click="scrollToTop"
      :title="'回到顶部'"
    >
      <el-icon><ArrowUp /></el-icon>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted }

 from 'vue'
import { ArrowUp } from '@element-plus/icons-vue'

const visible = ref(false)

// 滚动监听
const handleScroll = () => {
  visible.value = window.scrollY > 300
}

// 滚动到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgb(0 123 255 / 30%);
  transition: all 0.3s ease;
  z-index: 999;
  
  &:hover {
    background: var(--primary-hover);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgb(0 123 255 / 40%);
  }
  
  .el-icon {
    color: white;
    font-size: 20px;
  }
  
  @media (width <= 768px) {
    bottom: 20px;
    right: 20px;
    width: 45px;
    height: 45px;
    
    .el-icon {
      font-size: 18px;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>