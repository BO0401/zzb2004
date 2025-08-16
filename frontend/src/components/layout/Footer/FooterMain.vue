<template>
  <footer class="footer-main">
    <div class="footer-container">
      <!-- 主要内容区域 -->
      <div class="footer-content">
        <!-- 关于部分 -->
        <div class="footer-section">
          <h3 class="section-title">关于ZZB2004</h3>
          <p class="section-desc">
            专注于前端开发技术分享，记录学习成长的点点滴滴。
            从HTML、CSS到JavaScript、Vue，一起探索前端世界的无限可能。
          </p>
          <div class="social-links">
            <a href="https://github.com/zzb2004" target="_blank" class="social-link" title="GitHub">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="#" class="social-link" title="邮箱">
              <el-icon><Message /></el-icon>
            </a>
          </div>
        </div>
        
        <!-- 快速链接 -->
        <div class="footer-section">
          <h3 class="section-title">快速导航</h3>
          <ul class="link-list">
            <li><router-link to="/">首页</router-link></li>
            <li><router-link to="/tutorials">前端教程</router-link></li>
            <li><router-link to="/projects">项目展示</router-link></li>
            <li><router-link to="/about">关于我</router-link></li>
            <li><router-link to="/contact">联系我</router-link></li>
          </ul>
        </div>
        
        <!-- 教程分类 -->
        <div class="footer-section">
          <h3 class="section-title">教程分类</h3>
          <ul class="link-list">
            <li><router-link to="/tutorials/html">HTML基础</router-link></li>
            <li><router-link to="/tutorials/css">CSS样式</router-link></li>
            <li><router-link to="/tutorials/javascript">JavaScript</router-link></li>
            <li><router-link to="/tutorials/vue">Vue框架</router-link></li>
          </ul>
        </div>
        
        <!-- 统计信息 -->
        <div class="footer-section">
          <h3 class="section-title">网站统计</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-number">{{ statistics.tutorialCount }}

</span>
              <span class="stat-label">教程文章</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ statistics.projectCount }}

</span>
              <span class="stat-label">项目展示</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ formatNumber(statistics.viewCount) }}</span>
              <span class="stat-label">总访问量</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 底部版权信息 -->
      <div class="footer-bottom">
        <div class="copyright">
          <p>&copy; {{ currentYear }}

 ZZB2004. All rights reserved.</p>
          <p class="powered-by">
            Powered by <span class="tech-stack">Vue 3</span> + 
            <span class="tech-stack">TypeScript</span> + 
            <span class="tech-stack">Vite</span>
          </p>
        </div>
        <div class="footer-links">
          <a href="#" class="footer-link">隐私政策</a>
          <span class="divider">|</span>
          <a href="#" class="footer-link">使用条款</a>
          <span class="divider">|</span>
          <a href="#" class="footer-link">网站地图</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed }

 from 'vue'
import { useAppStore }

 from '@/stores/app'
import { Message } from '@element-plus/icons-vue'

const appStore = useAppStore()

const currentYear = new Date().getFullYear()
const statistics = computed(() => appStore.statistics)

// 格式化数字显示
const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

</script>

<style lang="scss" scoped>
.footer-main {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  margin-top: 60px;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
  
  @media (width <= 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}

.footer-section {
  .section-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: 16px;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 30px;
      height: 2px;
      background: var(--primary-color);
    }
  }
  
  .section-desc {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 20px;
  }
}

.social-links {
  display: flex;
  gap: 12px;
  
  .social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    color: var(--text-secondary);
    text-decoration: none;
    transition: all 0.3s ease;
    
    &:hover {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: white;
      transform: translateY(-2px);
    }
    
    svg, .el-icon {
      width: 18px;
      height: 18px;
    }
  }
}

.link-list {
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    margin-bottom: 8px;
    
    a {
      color: var(--text-secondary);
      text-decoration: none;
      transition: color 0.3s ease;
      
      &:hover {
        color: var(--primary-color);
      }
    }
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  
  .stat-item {
    text-align: center;
    padding: 16px;
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: var(--primary-color);
      transform: translateY(-2px);
    }
    
    .stat-number {
      display: block;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--primary-color);
      margin-bottom: 4px;
    }
    
    .stat-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
  }
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
  
  @media (width <= 768px) {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
}

.copyright {
  color: var(--text-secondary);
  font-size: 0.875rem;
  
  p {
    margin: 0;
    margin-bottom: 4px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  .powered-by {
    .tech-stack {
      color: var(--primary-color);
      font-weight: 500;
    }
  }
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .footer-link {
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 0.875rem;
    transition: color 0.3s ease;
    
    &:hover {
      color: var(--primary-color);
    }
  }
  
  .divider {
    color: var(--border-color);
  }
}
</style>