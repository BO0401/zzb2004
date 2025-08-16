<template>
  <div class="home-page">
    <!-- 英雄区域 -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
              <span class="greeting">你好，我是</span>
              <span class="name">ZZB2004</span>
            </h1>
            <p class="hero-subtitle">
              一名热爱前端开发的学习者，专注于分享前端技术与项目经验
            </p>
            <div class="hero-tags">
              <span class="tag">Vue.js</span>
              <span class="tag">TypeScript</span>
              <span class="tag">JavaScript</span>
              <span class="tag">CSS3</span>
              <span class="tag">HTML5</span>
            </div>
            <div class="hero-actions">
              <router-link to="/tutorials" class="btn btn-primary">
                <el-icon><Document /></el-icon>
                浏览教程
              </router-link>
              <router-link to="/projects" class="btn btn-outline">
                <el-icon><Folder /></el-icon>
                查看项目
              </router-link>
            </div>
          </div>
          <div class="hero-avatar">
            <div class="avatar-container">
              <img src="/avatar.svg" alt="ZZB2004" class="avatar-img" />
              <div class="avatar-ring"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="hero-bg">
        <div class="bg-shape shape-1"></div>
        <div class="bg-shape shape-2"></div>
        <div class="bg-shape shape-3"></div>
      </div>
    </section>
    
    <!-- 特色功能区域 -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">学习路径</h2>
        <p class="section-subtitle">从基础到进阶，系统化的前端学习体验</p>
        <div class="features-grid">
          <div class="feature-card" v-for="feature in features" :key="feature.id">
            <div class="feature-icon">
              <component :is="feature.icon" />
            </div>
            <h3 class="feature-title">{{ feature.title }}

</h3>
            <p class="feature-desc">{{ feature.description }}

</p>
            <router-link :to="feature.link" class="feature-link">
              开始学习 <el-icon><ArrowRight /></el-icon>
            </router-link>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 最新教程 -->
    <section class="tutorials-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">最新教程</h2>
          <router-link to="/tutorials" class="more-link">
            查看全部 <el-icon><ArrowRight /></el-icon>
          </router-link>
        </div>
        <div class="tutorials-grid">
          <div class="tutorial-card" v-for="tutorial in latestTutorials" :key="tutorial.id">
            <div class="tutorial-cover">
              <img :src="tutorial.cover" :alt="tutorial.title" />
              <div class="tutorial-category">{{ tutorial.category }}

</div>
            </div>
            <div class="tutorial-content">
              <h3 class="tutorial-title">{{ tutorial.title }}

</h3>
              <p class="tutorial-desc">{{ tutorial.description }}

</p>
              <div class="tutorial-meta">
                <span class="tutorial-date">{{ formatDate(tutorial.createdAt) }}

</span>
                <span class="tutorial-views">
                  <el-icon><View /></el-icon>
                  {{ tutorial.views }}

                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 项目展示 -->
    <section class="projects-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">精选项目</h2>
          <router-link to="/projects" class="more-link">
            查看全部 <el-icon><ArrowRight /></el-icon>
          </router-link>
        </div>
        <div class="projects-grid">
          <div class="project-card" v-for="project in featuredProjects" :key="project.id">
            <div class="project-image">
              <img :src="project.image" :alt="project.title" />
              <div class="project-overlay">
                <div class="project-actions">
                  <a :href="project.demo" target="_blank" class="action-btn" title="在线预览">
                    <el-icon><View /></el-icon>
                  </a>
                  <a :href="project.github" target="_blank" class="action-btn" title="查看源码">
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div class="project-content">
              <h3 class="project-title">{{ project.title }}

</h3>
              <p class="project-desc">{{ project.description }}

</p>
              <div class="project-tech">
                <span class="tech-tag" v-for="tech in project.technologies" :key="tech">
                  {{ tech }}

                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 统计数据 -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item" v-for="stat in stats" :key="stat.label">
            <div class="stat-icon">
              <component :is="stat.icon" />
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stat.value }}

</div>
              <div class="stat-label">{{ stat.label }}

</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import {
  Document, Folder, ArrowRight, View,
  Monitor
} from '@element-plus/icons-vue'

const appStore = useAppStore()

// 特色功能
const features = ref([
  {
    id: 1,
    icon: Monitor,
    title: 'HTML基础',
    description: '从零开始学习HTML，掌握网页结构的基本知识',
    link: '/tutorials/html'
  },
  {
    id: 2,
    icon: Document,
    title: 'CSS样式',
    description: '学习CSS样式设计，让网页变得美观动人',
    link: '/tutorials/css'
  },
  {
    id: 3,
    icon: Monitor,
    title: 'JavaScript',
    description: '掌握JavaScript编程，为网页添加交互功能',
    link: '/tutorials/javascript'
  },
  {
    id: 4,
    icon: View,
    title: 'Vue框架',
    description: '学习Vue.js框架，构建现代化的前端应用',
    link: '/tutorials/vue'
  }
])

// 最新教程
const latestTutorials = ref([
  {
    id: 1,
    title: 'Vue 3 Composition API 详解',
    description: '深入了解Vue 3的Composition API，掌握现代Vue开发方式',
    cover: '/logo.svg',
    category: 'Vue',
    createdAt: new Date('2025-07-29'),
    views: 1234
  },
  {
    id: 2,
    title: 'CSS Grid 布局完全指南',
    description: '全面学习CSS Grid布局，轻松实现复杂的网页布局',
    cover: '/logo.svg',
    category: 'CSS',
    createdAt: new Date('2025-07-29'),
    views: 856
  },
  {
    id: 3,
    title: 'JavaScript ES6+ 新特性',
    description: '掌握JavaScript最新特性，提升代码质量和开发效率',
    cover: '/logo.svg',
    category: 'JavaScript',
    createdAt: new Date('2025-07-29'),
    views: 2341
  }
])

// 精选项目
const featuredProjects = ref([
  {
    id: 1,
    title: '个人博客系统',
    description: '基于Vue 3和TypeScript开发的现代化博客系统',
    image: '/logo.svg',
    technologies: ['Vue 3', 'TypeScript', 'Vite'],
    demo: 'https://demo.example.com',
    github: 'https://github.com/zzb2004/blog'
  },
  {
    id: 2,
    title: '任务管理应用',
    description: '简洁高效的任务管理工具，支持拖拽排序和分类管理',
    image: '/logo.svg',
    technologies: ['Vue 3', 'Element Plus', 'Pinia'],
    demo: 'https://demo.example.com',
    github: 'https://github.com/zzb2004/todo'
  },
  {
    id: 3,
    title: '天气预报应用',
    description: '实时天气查询应用，支持多城市天气预报和历史数据',
    image: '/logo.svg',
    technologies: ['Vue 3', 'Axios', 'Chart.js'],
    demo: 'https://demo.example.com',
    github: 'https://github.com/zzb2004/weather'
  }
])

// 统计数据
const stats = computed(() => [
  {
    icon: 'Document',
    value: appStore.statistics.tutorialCount || '20+',
    label: '教程文章'
  },
  {
    icon: 'Folder',
    value: appStore.statistics.projectCount || '15+',
    label: '项目展示'
  },
  {
    icon: 'View',
    value: formatNumber(appStore.statistics.viewCount || 10000),
    label: '总访问量'
  },
  {
    icon: 'Trophy',
    value: '2+',
    label: '学习年限'
  }
])

// 格式化日期
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 格式化数字
const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

onMounted(() => {
  // 初始化统计数据
  appStore.updateStatistics({
    tutorialCount: 25,
    projectCount: 18,
    viewCount: 12580,
    visitCount: 3240
  })
})
</script>

<style lang="scss" scoped>
.home-page {
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

// 英雄区域
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, var(--primary-color) 0%, #667eea 100%);
  overflow: hidden;
  
  .hero-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    position: relative;
    z-index: 2;
  }
  
  .hero-content {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 60px;
    align-items: center;
    
    @media (width <= 768px) {
      grid-template-columns: 1fr;
      gap: 40px;
      text-align: center;
    }
  }
  
  .hero-text {
    color: white;
    
    .hero-title {
      font-size: 3.5rem;
      font-weight: 700;
      margin-bottom: 20px;
      line-height: 1.2;
      
      @media (width <= 768px) {
        font-size: 2.5rem;
      }
      
      .greeting {
        display: block;
        font-size: 1.5rem;
        font-weight: 400;
        opacity: 0.9;
        margin-bottom: 10px;
      }
      
      .name {
        background: linear-gradient(45deg, #fff, #f0f8ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }
    
    .hero-subtitle {
      font-size: 1.25rem;
      opacity: 0.9;
      margin-bottom: 30px;
      line-height: 1.6;
    }
    
    .hero-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 40px;
      
      .tag {
        padding: 6px 16px;
        background: rgb(255 255 255 / 20%);
        border: 1px solid rgb(255 255 255 / 30%);
        border-radius: 20px;
        font-size: 0.875rem;
        backdrop-filter: blur(10px);
      }
    }
    
    .hero-actions {
      display: flex;
      gap: 16px;
      
      @media (width <= 480px) {
        flex-direction: column;
      }
    }
  }
  
  .hero-avatar {
    display: flex;
    justify-content: center;
    
    .avatar-container {
      position: relative;
      
      .avatar-img {
        width: 200px;
        height: 200px;
        border-radius: 50%;
        object-fit: cover;
        border: 4px solid rgb(255 255 255 / 30%);
        position: relative;
        z-index: 2;
      }
      
      .avatar-ring {
        position: absolute;
        inset: -10px;
        border: 2px solid rgb(255 255 255 / 20%);
        border-radius: 50%;
        animation: rotate 20s linear infinite;
        
        &::before {
          content: '';
          position: absolute;
          inset: -2px;
          border: 2px solid transparent;
          border-top-color: rgb(255 255 255 / 50%);
          border-radius: 50%;
          animation: rotate 10s linear infinite reverse;
        }
      }
    }
  }
  
  .hero-bg {
    position: absolute;
    inset: 0;
    z-index: 1;
    
    .bg-shape {
      position: absolute;
      border-radius: 50%;
      background: rgb(255 255 255 / 10%);
      animation: float 6s ease-in-out infinite;
      
      &.shape-1 {
        width: 100px;
        height: 100px;
        top: 20%;
        right: 10%;
        animation-delay: 0s;
      }
      
      &.shape-2 {
        width: 150px;
        height: 150px;
        bottom: 20%;
        left: 10%;
        animation-delay: 2s;
      }
      
      &.shape-3 {
        width: 80px;
        height: 80px;
        top: 60%;
        right: 20%;
        animation-delay: 4s;
      }
    }
  }
}

// 按钮样式
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &.btn-primary {
    background: white;
    color: var(--primary-color);
    
    &:hover {
      background: #f8f9fa;
      transform: translateY(-2px);
    }
  }
  
  &.btn-outline {
    background: transparent;
    color: white;
    border: 2px solid rgb(255 255 255 / 30%);
    
    &:hover {
      background: rgb(255 255 255 / 10%);
      border-color: rgb(255 255 255 / 50%);
      transform: translateY(-2px);
    }
  }
}

// 通用区域样式
section {
  padding: 80px 0;
  
  @media (width <= 768px) {
    padding: 60px 0;
  }
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 16px;
  color: var(--text-color);
  
  @media (width <= 768px) {
    font-size: 2rem;
  }
}

.section-subtitle {
  text-align: center;
  color: var(--text-secondary);
  font-size: 1.125rem;
  margin-bottom: 60px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  
  @media (width <= 768px) {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .section-title {
    margin-bottom: 0;
    text-align: left;
    
    @media (width <= 768px) {
      text-align: center;
    }
  }
  
  .more-link {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
    
    &:hover {
      gap: 12px;
    }
  }
}

// 特色功能区域
.features-section {
  background: var(--bg-secondary);
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
  }
  
  .feature-card {
    background: var(--bg-color);
    padding: 40px 30px;
    border-radius: 12px;
    text-align: center;
    border: 1px solid var(--border-color);
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow);
      border-color: var(--primary-color);
    }
    
    .feature-icon {
      width: 60px;
      height: 60px;
      background: linear-gradient(45deg, var(--primary-color), #667eea);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      color: white;
      font-size: 24px;
    }
    
    .feature-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 12px;
      color: var(--text-color);
    }
    
    .feature-desc {
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 20px;
    }
    
    .feature-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
      
      &:hover {
        gap: 12px;
      }
    }
  }
}

// 教程区域
.tutorials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.tutorial-card {
  background: var(--bg-color);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow);
  }
  
  .tutorial-cover {
    position: relative;
    height: 200px;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    
    .tutorial-category {
      position: absolute;
      top: 12px;
      left: 12px;
      background: var(--primary-color);
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    
    &:hover img {
      transform: scale(1.05);
    }
  }
  
  .tutorial-content {
    padding: 20px;
    
    .tutorial-title {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 8px;
      color: var(--text-color);
      line-height: 1.4;
    }
    
    .tutorial-desc {
      color: var(--text-secondary);
      line-height: 1.5;
      margin-bottom: 16px;
      display: -webkit-box;
      /* stylelint-disable-next-line property-no-vendor-prefix */
      -webkit-line-clamp: 2;
      /* stylelint-disable-next-line property-no-vendor-prefix */
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .tutorial-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
      color: var(--text-secondary);
      
      .tutorial-views {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
  }
}

// 项目区域
.projects-section {
  background: var(--bg-secondary);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
}

.project-card {
  background: var(--bg-color);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow);
  }
  
  .project-image {
    position: relative;
    height: 200px;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    
    .project-overlay {
      position: absolute;
      inset: 0;
      background: rgb(0 0 0 / 70%);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      
      .project-actions {
        display: flex;
        gap: 12px;
        
        .action-btn {
          width: 40px;
          height: 40px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-color);
          text-decoration: none;
          transition: all 0.3s ease;
          
          &:hover {
            background: var(--primary-color);
            color: white;
            transform: scale(1.1);
          }
        }
      }
    }
    
    &:hover {
      img {
        transform: scale(1.05);
      }
      
      .project-overlay {
        opacity: 1;
      }
    }
  }
  
  .project-content {
    padding: 20px;
    
    .project-title {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 8px;
      color: var(--text-color);
    }
    
    .project-desc {
      color: var(--text-secondary);
      line-height: 1.5;
      margin-bottom: 16px;
      display: -webkit-box;
      /* stylelint-disable-next-line property-no-vendor-prefix */
      -webkit-line-clamp: 2;
      /* stylelint-disable-next-line property-no-vendor-prefix */
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .project-tech {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      
      .tech-tag {
        padding: 4px 8px;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        font-size: 0.75rem;
        color: var(--text-secondary);
      }
    }
  }
}

// 统计区域
.stats-section {
  background: linear-gradient(135deg, var(--primary-color) 0%, #667eea 100%);
  color: white;
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 40px;
  }
  
  .stat-item {
    display: flex;
    align-items: center;
    gap: 20px;
    text-align: left;
    
    @media (width <= 768px) {
      flex-direction: column;
      text-align: center;
      gap: 12px;
    }
    
    .stat-icon {
      width: 60px;
      height: 60px;
      background: rgb(255 255 255 / 20%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      backdrop-filter: blur(10px);
    }
    
    .stat-content {
      .stat-number {
        font-size: 2rem;
        font-weight: 700;
        display: block;
        margin-bottom: 4px;
      }
      
      .stat-label {
        opacity: 0.9;
        font-size: 0.875rem;
      }
    }
  }
}

// 动画
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-20px);
  }
}
</style>