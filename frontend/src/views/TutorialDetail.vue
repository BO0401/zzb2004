<template>
  <div class="tutorial-detail-page">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>
    
    <!-- 教程内容 -->
    <div v-else-if="tutorial" class="tutorial-content">
      <!-- 教程头部 -->
      <section class="tutorial-header">
        <div class="container">
          <div class="header-content">
            <!-- 面包屑导航 -->
            <el-breadcrumb separator="/" class="breadcrumb">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item :to="{ path: '/tutorials' }">前端教程</el-breadcrumb-item>
              <el-breadcrumb-item>{{ tutorial.category }}

</el-breadcrumb-item>
              <el-breadcrumb-item class="current">{{ tutorial.title }}

</el-breadcrumb-item>
            </el-breadcrumb>
            
            <!-- 教程信息 -->
            <div class="tutorial-info">
              <div class="tutorial-meta">
                <span class="category-tag">{{ tutorial.category }}

</span>
                <span class="difficulty-tag" :class="tutorial.difficulty">
                  {{ getDifficultyText(tutorial.difficulty) }}

                </span>
                <span class="status-tag" :class="tutorial.status">
                  {{ getStatusText(tutorial.status) }}

                </span>
              </div>
              
              <h1 class="tutorial-title">{{ tutorial.title }}

</h1>
              <p class="tutorial-description">{{ tutorial.description }}

</p>
              
              <div class="tutorial-stats">
                <div class="stat-item">
                  <el-icon><View /></el-icon>
                  <span>{{ formatNumber(tutorial.views) }}

 阅读</span>
                </div>

                <div class="stat-item">
                  <el-icon><Clock /></el-icon>
                  <span>{{ tutorial.readTime }}

 分钟阅读</span>
                </div>
                <div class="stat-item">
                  <el-icon><Calendar /></el-icon>
                  <span>{{ formatDate(tutorial.updatedAt) }}

</span>
                </div>
              </div>
              

            </div>
          </div>
        </div>
      </section>
      
      <!-- 主要内容区域 -->
      <section class="main-content">
        <div class="container">
          <div class="content-layout">
            <!-- 文章内容 -->
            <article class="article-content">
              <!-- 目录 -->
              <div v-if="tableOfContents.length > 0" class="table-of-contents">
                <h3>目录</h3>
                <ul class="toc-list">
                  <li 
                    v-for="item in tableOfContents" 
                    :key="item.id"
                    :class="['toc-item', `level-${item.level}`, { active: activeSection === item.id }]"
                  >
                    <a @click="scrollToSection(item.id)" class="toc-link">
                      {{ item.text }}

                    </a>
                  </li>
                </ul>
              </div>
              
              <!-- Markdown 内容 -->
              <div 
                class="markdown-content"
                ref="contentRef"
              >
                <div v-if="!error" v-html="content"></div>
                <div v-else class="text-red-400">加载失败，请稍后重试。</div>
              </div>
              
              <!-- 标签 -->
              <div v-if="tutorial.tags && tutorial.tags.length > 0" class="article-tags">
                <h4>相关标签</h4>
                <div class="tags-list">
                  <el-tag 
                    v-for="tag in tutorial.tags" 
                    :key="tag"
                    class="tag-item"
                    @click="searchByTag(tag)"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
              </div>
              
              <!-- 上一篇/下一篇 -->
              <div class="article-navigation">
                <div class="nav-item prev" v-if="prevTutorial">
                  <span class="nav-label">上一篇</span>
                  <router-link :to="`/tutorials/${prevTutorial.category}/${prevTutorial.id}`" class="nav-link">
                    <el-icon><ArrowLeft /></el-icon>
                    {{ prevTutorial.title }}
                  </router-link>
                </div>
                
                <div class="nav-item next" v-if="nextTutorial">
                  <span class="nav-label">下一篇</span>
                  <router-link :to="`/tutorials/${nextTutorial.category}/${nextTutorial.id}`" class="nav-link">
                    {{ nextTutorial.title }}

                    <el-icon><ArrowRight /></el-icon>
                  </router-link>
                </div>
              </div>
            </article>
            
            <!-- 侧边栏 -->
            <aside class="sidebar">
              <!-- 作者信息 -->
              <div class="author-card">
                <div class="author-avatar">
                  <img src="/avatar.svg" alt="ZZB2004" />
                </div>
                <div class="author-info">
                  <h4 class="author-name">ZZB2004</h4>
                  <p class="author-title">前端开发者</p>
                  <p class="author-desc">专注于现代前端技术，热爱分享与学习</p>
                  <div class="author-stats">
                    <div class="stat">
                      <span class="stat-number">{{ authorStats.articles }}

</span>
                      <span class="stat-label">文章</span>
                    </div>
                    <div class="stat">
                      <span class="stat-number">{{ formatNumber(authorStats.views) }}

</span>
                      <span class="stat-label">阅读</span>
                    </div>

                  </div>
                  <el-button type="primary" size="small" class="follow-btn">
                    <el-icon><Plus /></el-icon>
                    关注
                  </el-button>
                </div>
              </div>
              
              <!-- 相关教程 -->
              <div class="related-tutorials">
                <h4>相关教程</h4>
                <div class="related-list">
                  <div 
                    v-for="related in relatedTutorials" 
                    :key="related.id"
                    class="related-item"
                    @click="$router.push(`/tutorials/${related.id}`)"
                  >
                    <div class="related-image">
                      <img :src="related.cover" :alt="related.title" />
                    </div>
                    <div class="related-content">
                      <h5 class="related-title">{{ related.title }}

</h5>
                      <div class="related-meta">
                        <span class="related-views">
                          <el-icon><View /></el-icon>
                          {{ formatNumber(related.views) }}

                        </span>
                        <span class="related-date">{{ formatDate(related.createdAt) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 目录导航（移动端隐藏） -->
              <div v-if="tableOfContents.length > 0" class="toc-sidebar">
                <h4>文章目录</h4>
                <ul class="toc-nav">
                  <li 
                    v-for="item in tableOfContents" 
                    :key="item.id"
                    :class="['toc-nav-item', `level-${item.level}`, { active: activeSection === item.id }]"
                  >
                    <a @click="scrollToSection(item.id)" class="toc-nav-link">
                      {{ item.text }}
                    </a>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
      

    </div>
    
    <!-- 错误状态 -->
    <div v-else class="error-container">
      <el-result
        icon="error"
        title="教程不存在"
        sub-title="抱歉，您访问的教程不存在或已被删除"
      >
        <template #extra>
          <el-button type="primary" @click="$router.push('/tutorials')">
            返回教程列表
          </el-button>
        </template>
      </el-result>
    </div>
    
    <!-- 回到顶部 -->
    <el-backtop :right="40" :bottom="40" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  getTutorialContent, 
  getTutorialById, 
  getRelatedTutorials,
  getAllTutorials,
  formatNumber,
  formatDate,
  getDifficultyText,
  getStatusText,
  type Tutorial
} from '../services/tutorialService'

import {
  View, Clock, Calendar,
  ArrowLeft, ArrowRight, Plus
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(true)
const tutorial = ref<Tutorial | null>(null)
const content = ref('')
const error = ref(false)
const tableOfContents = ref<any[]>([])
const activeSection = ref('')
const contentRef = ref<HTMLElement>()

const showError = ref(false)
const errorMessage = ref('')

// 相关数据
const prevTutorial = ref<any>(null)
const nextTutorial = ref<any>(null)
const relatedTutorials = ref<any[]>([])
const authorStats = reactive({
  articles: 45,
  views: 128000,
  likes: 5600
})

// 获取教程详情
const loadTutorial = async () => {
  try {
    loading.value = true
    error.value = false
    
    const tutorialId = route.params.id as string
    // const categoryId = route.params.category as string
    
    // 从服务中获取教程数据
    const tutorialData = getTutorialById(tutorialId)
    if (!tutorialData) {
      error.value = true
      return
    }
    
    tutorial.value = tutorialData
    
    // 加载教程内容
    content.value = await getTutorialContent(tutorialData.category, tutorialId)
    
    // 获取相关教程
    relatedTutorials.value = getRelatedTutorials(tutorialData, 3)
    
    // 动态获取上一篇/下一篇教程
    const allTutorials = getAllTutorials()
    const currentIndex = allTutorials.findIndex(t => t.id === tutorialId)
    
    if (currentIndex > 0) {
      const prev = allTutorials[currentIndex - 1]
      prevTutorial.value = {
        id: prev.id,
        title: prev.title,
        category: prev.category
      }
    } else {
      prevTutorial.value = null
    }
    
    if (currentIndex < allTutorials.length - 1) {
      const next = allTutorials[currentIndex + 1]
      nextTutorial.value = {
        id: next.id,
        title: next.title,
        category: next.category
      }
    } else {
      nextTutorial.value = null
    }
    

    
    // 生成目录
    await nextTick()
    generateTableOfContents()
    
  } catch (err) {
    // 处理错误但不输出调试信息
    loading.value = false
    showError.value = true
    errorMessage.value = '获取教程详情失败'
  } finally {
    loading.value = false
  }
}

// 生成目录
const generateTableOfContents = () => {
  if (!content.value) return
  
  const headings = content.value.match(/<h[1-6][^>]*id="([^"]*)"[^>]*>([^<]*)<\/h[1-6]>/g)
  if (headings) {
    tableOfContents.value = headings.map(heading => {
      const matches = heading.match(/<h([1-6])[^>]*id="([^"]*)"[^>]*>([^<]*)<\/h[1-6]>/)
      if (matches) {
        return {
          id: matches[2],
          title: matches[3],
          level: parseInt(matches[1])
        }
      }
      return null
    }).filter(Boolean) as Array<{id: string, title: string, level: number}>
  }
}

// 滚动到指定章节
const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}




// 根据标签搜索
const searchByTag = (tag: string) => {
  router.push({
    path: '/tutorials',
    query: { tag }
  })
}



// 监听滚动，更新当前活跃章节
const handleScroll = () => {
  const headings = document.querySelectorAll('h2[id], h3[id], h4[id]')
  let current = ''
  
  headings.forEach(heading => {
    const rect = heading.getBoundingClientRect()
    if (rect.top <= 100) {
      current = heading.id
    }
  })
  
  activeSection.value = current
}

// 监听路由变化
watch(() => route.params.id, () => {
  if (route.params.id) {
    loadTutorial()
  }
}, { immediate: true })

// 组件挂载
onMounted(() => {
  loadTutorial()
  window.addEventListener('scroll', handleScroll)
})

watch(() => route.fullPath, () => {
  loadTutorial()
})

// 组件卸载时清理事件监听
// onUnmounted(() => {
//   window.removeEventListener('scroll', handleScroll)
// })
</script>

<style lang="scss" scoped>
.tutorial-detail-page {
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

// 加载和错误状态
.loading-container,
.error-container {
  padding: 80px 0;
  
  .container {
    max-width: 800px;
  }
}

// 教程头部
.tutorial-header {
  background: linear-gradient(135deg, var(--primary-color) 0%, #667eea 100%);
  color: white;
  padding: 40px 0 60px;
  
  .breadcrumb {
    margin-bottom: 30px;
    
    :deep(.el-breadcrumb__inner) {
      color: rgb(255 255 255 / 80%);
      
      &.is-link {
        color: white;
        
        &:hover {
          color: rgb(255 255 255 / 80%);
        }
      }
    }
    
    :deep(.el-breadcrumb__separator) {
      color: rgb(255 255 255 / 60%);
    }
    
    .current {
      :deep(.el-breadcrumb__inner) {
        color: rgb(255 255 255 / 60%);
      }
    }
  }
  
  .tutorial-meta {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    
    .category-tag,
    .difficulty-tag,
    .status-tag {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    
    .category-tag {
      background: rgb(255 255 255 / 20%);
      color: white;
    }
    
    .difficulty-tag {
      &.beginner {
        background: #67c23a;
        color: white;
      }
      
      &.intermediate {
        background: #e6a23c;
        color: white;
      }
      
      &.advanced {
        background: #f56c6c;
        color: white;
      }
    }
    
    .status-tag {
      &.published {
        background: #67c23a;
        color: white;
      }
      
      &.updated {
        background: #409eff;
        color: white;
      }
    }
  }
  
  .tutorial-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 16px;
    line-height: 1.2;
    
    @media (width <= 768px) {
      font-size: 2rem;
    }
  }
  
  .tutorial-description {
    font-size: 1.125rem;
    opacity: 0.9;
    margin-bottom: 30px;
    line-height: 1.6;
  }
  
  .tutorial-stats {
    display: flex;
    gap: 24px;
    margin-bottom: 30px;
    
    @media (width <= 768px) {
      flex-wrap: wrap;
      gap: 16px;
    }
    
    .stat-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.875rem;
      opacity: 0.9;
    }
  }
  
  .tutorial-actions {
    display: flex;
    gap: 12px;
    
    @media (width <= 768px) {
      flex-wrap: wrap;
    }
  }
}

// 主要内容
.main-content {
  padding: 60px 0;
  
  .content-layout {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 40px;
    
    @media (width <= 1024px) {
      grid-template-columns: 1fr;
      gap: 30px;
    }
  }
}

// 文章内容
.article-content {
  .table-of-contents {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 30px;
    
    @media (width >= 1025px) {
      display: none;
    }
    
    h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-color);
      margin-bottom: 16px;
    }
    
    .toc-list {
      list-style: none;
      padding: 0;
      margin: 0;
      
      .toc-item {
        margin-bottom: 8px;
        
        &.level-2 {
          padding-left: 0;
        }
        
        &.level-3 {
          padding-left: 20px;
        }
        
        &.level-4 {
          padding-left: 40px;
        }
        
        &.active .toc-link {
          color: var(--primary-color);
          font-weight: 500;
        }
        
        .toc-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.875rem;
          cursor: pointer;
          transition: color 0.3s ease;
          
          &:hover {
            color: var(--primary-color);
          }
        }
      }
    }
  }
  
  .markdown-content {
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 40px;
    margin-bottom: 30px;
    
    @media (width <= 768px) {
      padding: 20px;
    }
    
    :deep(h2) {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-color);
      margin: 30px 0 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid var(--border-color);
      
      &:first-child {
        margin-top: 0;
      }
    }
    
    :deep(h3) {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-color);
      margin: 24px 0 12px;
    }
    
    :deep(p) {
      color: var(--text-secondary);
      line-height: 1.8;
      margin-bottom: 16px;
    }
    
    :deep(code) {
      background: var(--bg-secondary);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Fira Code', monospace;
      font-size: 0.875rem;
    }
    
    :deep(pre) {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      overflow-x: auto;
      margin: 16px 0;
      
      code {
        background: none;
        padding: 0;
      }
    }
  }
  
  .article-tags {
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 30px;
    
    h4 {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-color);
      margin-bottom: 16px;
    }
    
    .tags-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      
      .tag-item {
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-2px);
        }
      }
    }
  }
  
  .article-navigation {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    
    @media (width <= 768px) {
      grid-template-columns: 1fr;
    }
    
    .nav-item {
      background: var(--bg-color);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 20px;
      
      &.prev {
        text-align: left;
      }
      
      &.next {
        text-align: right;
      }
      
      .nav-label {
        display: block;
        font-size: 0.75rem;
        color: var(--text-secondary);
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .nav-link {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--text-color);
        text-decoration: none;
        font-weight: 500;
        transition: color 0.3s ease;
        
        &:hover {
          color: var(--primary-color);
        }
        
        .nav-item.next & {
          justify-content: flex-end;
        }
      }
    }
  }
}

// 侧边栏
.sidebar {
  @media (width <= 1024px) {
    order: -1;
  }
  
  > div {
    margin-bottom: 30px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.author-card {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  
  .author-avatar {
    margin-bottom: 16px;
    
    img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
    }
  }
  
  .author-name {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: 4px;
  }
  
  .author-title {
    font-size: 0.875rem;
    color: var(--primary-color);
    margin-bottom: 8px;
  }
  
  .author-desc {
    font-size: 0.875rem;
    color: var(--text-secondary);
    line-height: 1.5;
    margin-bottom: 16px;
  }
  
  .author-stats {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
    
    .stat {
      text-align: center;
      
      .stat-number {
        display: block;
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--text-color);
      }
      
      .stat-label {
        font-size: 0.75rem;
        color: var(--text-secondary);
      }
    }
  }
  
  .follow-btn {
    width: 100%;
  }
}

.related-tutorials {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  
  h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: 16px;
  }
  
  .related-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .related-item {
    display: flex;
    gap: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateX(4px);
    }
    
    .related-image {
      flex-shrink: 0;
      
      img {
        width: 60px;
        height: 60px;
        border-radius: 6px;
        object-fit: cover;
      }
    }
    
    .related-content {
      flex: 1;
      
      .related-title {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-color);
        margin-bottom: 6px;
        line-height: 1.4;
        display: -webkit-box;
        /* stylelint-disable-next-line property-no-vendor-prefix */
        -webkit-box-orient: vertical;
        /* stylelint-disable-next-line property-no-vendor-prefix */
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .related-meta {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 0.75rem;
        color: var(--text-secondary);
        
        .related-views {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }
    }
  }
}

.toc-sidebar {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  position: sticky;
  top: 20px;
  
  @media (width <= 1024px) {
    display: none;
  }
  
  h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: 16px;
  }
  
  .toc-nav {
    list-style: none;
    padding: 0;
    margin: 0;
    
    .toc-nav-item {
      margin-bottom: 8px;
      
      &.level-2 {
        padding-left: 0;
      }
      
      &.level-3 {
        padding-left: 16px;
      }
      
      &.level-4 {
        padding-left: 32px;
      }
      
      &.active .toc-nav-link {
        color: var(--primary-color);
        font-weight: 500;
      }
      
      .toc-nav-link {
        color: var(--text-secondary);
        text-decoration: none;
        font-size: 0.875rem;
        cursor: pointer;
        transition: color 0.3s ease;
        display: block;
        padding: 4px 0;
        
        &:hover {
          color: var(--primary-color);
        }
      }
    }
  }
}


</style>