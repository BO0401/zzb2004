<template>
  <div class="projects-page">
    <!-- 页面头部 -->
    <section class="page-header">
      <div class="container">
        <div class="header-content">
          <h1 class="page-title">项目展示</h1>
          <p class="page-subtitle">精心打造的前端项目作品集，展示技术实力与创意思维</p>
          <div class="breadcrumb">
            <router-link to="/">首页</router-link>
            <span class="separator">/</span>
            <span class="current">项目</span>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 筛选区域 -->
    <section class="filter-section">
      <div class="container">
        <div class="filter-controls">
          <div class="filter-tabs">
            <button 
              v-for="category in categories" 
              :key="category.id"
              :class="['filter-tab', { active: activeCategory === category.id }]"
              @click="setActiveCategory(category.id)"
            >
              <component :is="category.icon" class="tab-icon" />
              {{ category.name }}
              <span class="tab-count">{{ category.count }}</span>
            </button>
          </div>
          
          <div class="filter-actions">
            <el-select v-model="sortBy" placeholder="排序方式" style="width: 140px">
              <el-option label="最新" value="date" />
              <el-option label="最热" value="views" />
              <el-option label="名称" value="name" />
            </el-select>
            
            <div class="view-toggle">
              <button 
                :class="['view-btn', { active: viewMode === 'grid' }]"
                @click="viewMode = 'grid'"
                title="网格视图"
              >
                <el-icon><Grid /></el-icon>
              </button>
              <button 
                :class="['view-btn', { active: viewMode === 'list' }]"
                @click="viewMode = 'list'"
                title="列表视图"
              >
                <el-icon><List /></el-icon>
              </button>
            </div>
          </div>
        </div>
        
        <div class="search-box">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索项目..."
            :prefix-icon="Search"
            clearable
            @input="handleSearch"
          />
        </div>
      </div>
    </section>
    
    <!-- 项目列表 -->
    <section class="projects-section">
      <div class="container">
        <div 
          :class="[
            'projects-container',
            viewMode === 'grid' ? 'grid-view' : 'list-view'
          ]"
          v-if="filteredProjects.length > 0"
        >
          <div 
            v-for="project in paginatedProjects" 
            :key="project.id"
            :class="['project-card', viewMode]"
            @click="goToProject(project)"
          >
            <div class="project-image">
              <img :src="project.image" :alt="project.title" />
              <div class="project-overlay">
                <div class="project-actions">
                  <a 
                    :href="project.demo" 
                    target="_blank" 
                    class="action-btn demo-btn"
                    title="在线预览"
                    @click.stop
                  >
                    <el-icon><View /></el-icon>
                    <span v-if="viewMode === 'list'">预览</span>
                  </a>
                  <a 
                    :href="project.github" 
                    target="_blank" 
                    class="action-btn github-btn"
                    title="查看源码"
                    @click.stop
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span v-if="viewMode === 'list'">源码</span>
                  </a>
                </div>
              </div>
              <div class="project-status" :class="project.status">
                {{ getStatusText(project.status) }}

              </div>
            </div>
            
            <div class="project-content">
              <div class="project-header">
                <h3 class="project-title">{{ project.title }}

</h3>
                <div class="project-meta">
                  <span class="project-date">
                    <el-icon><Calendar /></el-icon>
                    {{ formatDate(project.date) }}

                  </span>
                  <span class="project-views">
                    <el-icon><View /></el-icon>
                    {{ project.views }}

                  </span>
                </div>
              </div>
              
              <p class="project-desc">{{ project.description }}</p>
              
              <div class="project-features" v-if="project.features && project.features.length > 0">
                <h4>主要功能：</h4>
                <ul>
                  <li v-for="feature in project.features.slice(0, 3)" :key="feature">
                    {{ feature }}

                  </li>
                </ul>
              </div>
              
              <div class="project-tech">
                <span 
                  v-for="tech in project.technologies" 
                  :key="tech"
                  class="tech-tag"
                >
                  {{ tech }}

                </span>
              </div>
              
              <div class="project-footer" v-if="viewMode === 'list'">
                <div class="project-stats">
                  <span class="stat-item">
                    <el-icon><Star /></el-icon>
                    {{ project.stars || 0 }}

                  </span>
                  <span class="stat-item">
                    <el-icon><Fork /></el-icon>
                    {{ project.forks || 0 }}

                  </span>
                </div>
                
                <div class="project-actions-inline">
                  <a :href="project.demo" target="_blank" class="btn btn-primary">
                    <el-icon><View /></el-icon>
                    在线预览
                  </a>
                  <a :href="project.github" target="_blank" class="btn btn-outline">
                    <el-icon><Link /></el-icon>
                    查看源码
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 空状态 -->
        <div v-else class="empty-state">
          <el-icon class="empty-icon"><Folder /></el-icon>
          <h3>暂无相关项目</h3>
          <p>{{ searchKeyword ? '没有找到匹配的项目，请尝试其他关键词' : '该分类下暂无项目内容' }}

</p>
        </div>
        
        <!-- 分页 -->
        <div class="pagination-wrapper" v-if="totalPages > 1">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="filteredProjects.length"
            layout="prev, pager, next, jumper"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Search, Calendar, View, Folder, Grid, List,
  Star, Link
} from '@element-plus/icons-vue'

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  categoryId: string;
  technologies: string[];
  features?: string[];
  date: Date;
  views: number;
  stars?: number;
  forks?: number;
  demo: string;
  github: string;
  status: 'completed' | 'in-progress' | 'planning'
}

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number
}

const router = useRouter()
const route = useRoute()

// 响应式数据
const activeCategory = ref<string>('all')
const searchKeyword = ref<string>('')
const currentPage = ref<number>(1)
const pageSize = ref<number>(9)
const sortBy = ref<string>('date')
const viewMode = ref<'grid' | 'list'>('grid')

// 分类数据
const categories = ref<Category[]>([
  { id: 'all', name: '全部', icon: 'Grid', count: 0 },
  { id: 'web', name: 'Web应用', icon: 'Monitor', count: 0 },
  { id: 'mobile', name: '移动端', icon: 'Mobile', count: 0 },
  { id: 'component', name: '组件库', icon: 'Code', count: 0 },
  { id: 'tool', name: '工具类', icon: 'Cpu', count: 0 },
  { id: 'demo', name: '演示项目', icon: 'Trophy', count: 0 }
])

// 项目数据
const projects = ref<Project[]>([
  {
    id: 1,
    title: '个人博客系统',
    description: '基于Vue 3和TypeScript开发的现代化个人博客系统，支持文章管理、分类标签、评论系统等功能',
    image: '/project-images/blog-system.jpg',
    category: 'Web应用',
    categoryId: 'web',
    technologies: ['Vue 3', 'TypeScript', 'Vite', 'Element Plus', 'Pinia'],
    features: ['文章发布与管理', '分类标签系统', '评论互动', '响应式设计', '暗黑模式'],
    date: new Date('2024-01-20'),
    views: 2340,
    stars: 128,
    forks: 45,
    demo: 'https://blog-demo.example.com',
    github: 'https://github.com/zzb2004/blog-system',
    status: 'completed'
  },
  {
    id: 2,
    title: '任务管理应用',
    description: '简洁高效的任务管理工具，支持拖拽排序、分类管理、进度跟踪等功能，提升工作效率',
    image: '/project-images/todo-app.jpg',
    category: 'Web应用',
    categoryId: 'web',
    technologies: ['Vue 3', 'Element Plus', 'Pinia', 'Sortable.js'],
    features: ['拖拽排序', '任务分类', '进度跟踪', '数据持久化', '快捷操作'],
    date: new Date('2024-01-15'),
    views: 1890,
    stars: 89,
    forks: 32,
    demo: 'https://todo-demo.example.com',
    github: 'https://github.com/zzb2004/todo-app',
    status: 'completed'
  },
  {
    id: 3,
    title: '天气预报应用',
    description: '实时天气查询应用，支持多城市天气预报、历史数据查看、天气趋势分析等功能',
    image: '/project-images/weather-app.jpg',
    category: 'Web应用',
    categoryId: 'web',
    technologies: ['Vue 3', 'Axios', 'Chart.js', 'CSS3'],
    features: ['实时天气', '多城市支持', '历史数据', '趋势图表', '位置定位'],
    date: new Date('2024-01-10'),
    views: 1560,
    stars: 76,
    forks: 28,
    demo: 'https://weather-demo.example.com',
    github: 'https://github.com/zzb2004/weather-app',
    status: 'completed'
  },
  {
    id: 4,
    title: '音乐播放器',
    description: '基于Web Audio API开发的在线音乐播放器，支持歌词显示、播放列表、音效调节等功能',
    image: '/project-images/music-player.jpg',
    category: 'Web应用',
    categoryId: 'web',
    technologies: ['Vue 3', 'Web Audio API', 'Canvas', 'SCSS'],
    features: ['音频播放', '歌词同步', '可视化效果', '播放列表', '音效调节'],
    date: new Date('2024-01-05'),
    views: 2100,
    stars: 156,
    forks: 67,
    demo: 'https://music-demo.example.com',
    github: 'https://github.com/zzb2004/music-player',
    status: 'in-progress'
  },
  {
    id: 5,
    title: '移动端商城应用',
    description: '基于Vue 3开发的移动端电商应用，包含商品展示、购物车、订单管理等完整功能',
    image: '/project-images/mobile-shop.jpg',
    category: '移动端',
    categoryId: 'mobile',
    technologies: ['Vue 3', 'Vant', 'Pinia', 'Vite'],
    features: ['商品浏览', '购物车', '订单管理', '用户中心', '支付集成'],
    date: new Date('2023-12-28'),
    views: 1780,
    stars: 92,
    forks: 38,
    demo: 'https://shop-demo.example.com',
    github: 'https://github.com/zzb2004/mobile-shop',
    status: 'completed'
  },
  {
    id: 6,
    title: 'UI组件库',
    description: '基于Vue 3开发的轻量级UI组件库，提供常用的表单、导航、反馈等组件',
    image: '/project-images/ui-components.jpg',
    category: '组件库',
    categoryId: 'component',
    technologies: ['Vue 3', 'TypeScript', 'Rollup', 'SCSS'],
    features: ['组件丰富', 'TypeScript支持', '主题定制', '按需引入', '文档完善'],
    date: new Date('2023-12-20'),
    views: 1340,
    stars: 234,
    forks: 89,
    demo: 'https://ui-demo.example.com',
    github: 'https://github.com/zzb2004/ui-components',
    status: 'in-progress'
  },
  {
    id: 7,
    title: '代码生成工具',
    description: '前端代码生成工具，支持Vue组件、API接口、路由等代码的快速生成，提升开发效率',
    image: '/project-images/code-generator.jpg',
    category: '工具类',
    categoryId: 'tool',
    technologies: ['Node.js', 'Vue 3', 'Electron', 'Monaco Editor'],
    features: ['模板生成', '代码预览', '批量操作', '自定义模板', '导出功能'],
    date: new Date('2023-12-15'),
    views: 980,
    stars: 67,
    forks: 23,
    demo: 'https://generator-demo.example.com',
    github: 'https://github.com/zzb2004/code-generator',
    status: 'planning'
  },
  {
    id: 8,
    title: '数据可视化大屏',
    description: '基于ECharts和Vue 3开发的数据可视化大屏展示系统，支持多种图表类型和实时数据更新',
    image: '/project-images/data-screen.jpg',
    category: '演示项目',
    categoryId: 'demo',
    technologies: ['Vue 3', 'ECharts', 'WebSocket', 'CSS3'],
    features: ['多图表展示', '实时数据', '响应式布局', '动画效果', '主题切换'],
    date: new Date('2023-12-10'),
    views: 2890,
    stars: 189,
    forks: 78,
    demo: 'https://screen-demo.example.com',
    github: 'https://github.com/zzb2004/data-screen',
    status: 'completed'
  },
  {
    id: 9,
    title: '在线绘图工具',
    description: '基于Canvas和Vue 3开发的在线绘图工具，支持多种绘图工具和图层管理',
    image: '/project-images/drawing-tool.jpg',
    category: '工具类',
    categoryId: 'tool',
    technologies: ['Vue 3', 'Canvas', 'Fabric.js', 'TypeScript'],
    features: ['多种画笔', '图层管理', '撤销重做', '导出功能', '协作编辑'],
    date: new Date('2023-12-05'),
    views: 1450,
    stars: 112,
    forks: 45,
    demo: 'https://draw-demo.example.com',
    github: 'https://github.com/zzb2004/drawing-tool',
    status: 'in-progress'
  }
])

// 计算属性
const filteredProjects = computed(() => {
  let result = projects.value
  
  // 按分类筛选
  if (activeCategory.value !== 'all') {
    result = result.filter(project => project.categoryId === activeCategory.value)
  }
  
  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(project => 
      project.title.toLowerCase().includes(keyword) ||
      project.description.toLowerCase().includes(keyword) ||
      project.technologies.some(tech => tech.toLowerCase().includes(keyword))
    )
  }
  
  // 排序
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'date':
        return b.date.getTime() - a.date.getTime()
      case 'views':
        return b.views - a.views
      case 'name':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })
  
  return result
})

const totalPages = computed(() => {
  return Math.ceil(filteredProjects.value.length / pageSize.value)
})

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredProjects.value.slice(start, end)
})

// 方法
const setActiveCategory = (categoryId: string) => {
  activeCategory.value = categoryId
  currentPage.value = 1
  
  // 更新URL
  const query = { ...route.query }
  if (categoryId === 'all') {
    delete query.category
  }

 else {
    query.category = categoryId
  }
  router.replace({ query })
}

const handleSearch = () => {
  currentPage.value = 1
  
  // 更新URL
  const query = { ...route.query }
  if (searchKeyword.value) {
    query.search = searchKeyword.value
  }

 else {
    delete query.search
  }
  router.replace({ query })
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goToProject = (project: Project) => {
  router.push(`/projects/${project.id}`)
}

const getStatusText = (status: string): string => {
  const statusMap = {
    completed: '已完成',
    'in-progress': '进行中',
    planning: '计划中'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 更新分类计数
const updateCategoryCounts = () => {
  categories.value.forEach(category => {
    if (category.id === 'all') {
      category.count = projects.value.length
    } else {
      category.count = projects.value.filter(p => p.categoryId === category.id).length
    }
  })
}

// 监听路由变化
watch(() => route.query, (newQuery) => {
  if (newQuery.category && newQuery.category !== activeCategory.value) {
    activeCategory.value = newQuery.category as string
  }
  if (newQuery.search && newQuery.search !== searchKeyword.value) {
    searchKeyword.value = newQuery.search as string
  }
}, { immediate: true })

// 组件挂载
onMounted(() => {
  updateCategoryCounts()
  
  // 从URL参数初始化状态
  if (route.query.category) {
    activeCategory.value = route.query.category as string
  }
  if (route.query.search) {
    searchKeyword.value = route.query.search as string
  }
})
</script>

<style lang="scss" scoped>
.projects-page {
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

// 页面头部
.page-header {
  background: linear-gradient(135deg, var(--primary-color) 0%, #667eea 100%);
  color: white;
  padding: 80px 0 60px;
  
  .header-content {
    text-align: center;
    
    .page-title {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 16px;
      
      @media (width <= 768px) {
        font-size: 2.5rem;
      }
    }
    
    .page-subtitle {
      font-size: 1.25rem;
      opacity: 0.9;
      margin-bottom: 30px;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .breadcrumb {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 0.875rem;
      opacity: 0.8;
      
      a {
        color: white;
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
      
      .separator {
        margin: 0 4px;
      }
      
      .current {
        font-weight: 500;
      }
    }
  }
}

// 筛选区域
.filter-section {
  background: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
  padding: 30px 0;
  position: sticky;
  top: 70px;
  z-index: 10;
  
  .container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .filter-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    
    @media (width <= 768px) {
      flex-direction: column;
      align-items: stretch;
    }
  }
  
  .filter-tabs {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    
    .filter-tab {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border: 1px solid var(--border-color);
      border-radius: 20px;
      background: var(--bg-color);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.875rem;
      
      .tab-icon {
        font-size: 16px;
      }
      
      .tab-count {
        background: var(--bg-secondary);
        color: var(--text-secondary);
        padding: 2px 6px;
        border-radius: 8px;
        font-size: 0.75rem;
        min-width: 20px;
        text-align: center;
      }
      
      &:hover {
        border-color: var(--primary-color);
        color: var(--primary-color);
      }
      
      &.active {
        background: var(--primary-color);
        border-color: var(--primary-color);
        color: white;
        
        .tab-count {
          background: rgb(255 255 255 / 20%);
          color: white;
        }
      }
    }
  }
  
  .filter-actions {
    display: flex;
    align-items: center;
    gap: 16px;
    
    .view-toggle {
      display: flex;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      overflow: hidden;
      
      .view-btn {
        padding: 8px 12px;
        border: none;
        background: var(--bg-color);
        color: var(--text-secondary);
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          background: var(--bg-secondary);
        }
        
        &.active {
          background: var(--primary-color);
          color: white;
        }
      }
    }
  }
  
  .search-box {
    max-width: 400px;
    
    @media (width <= 768px) {
      max-width: none;
    }
  }
}

// 项目列表区域
.projects-section {
  padding: 40px 0 80px;
  
  .projects-container {
    margin-bottom: 40px;
    
    &.grid-view {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 30px;
      
      @media (width <= 768px) {
        grid-template-columns: 1fr;
        gap: 20px;
      }
    }
    
    &.list-view {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
  }
  
  .project-card {
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow);
      border-color: var(--primary-color);
    }
    
    &.grid {
      .project-image {
        height: 200px;
      }
      
      .project-content {
        padding: 20px;
      }
    }
    
    &.list {
      display: flex;
      
      .project-image {
        width: 300px;
        height: 200px;
        flex-shrink: 0;
      }
      
      .project-content {
        flex: 1;
        padding: 20px;
        display: flex;
        flex-direction: column;
      }
      
      @media (width <= 768px) {
        flex-direction: column;
        
        .project-image {
          width: 100%;
        }
      }
    }
    
    .project-image {
      position: relative;
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
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: white;
            border-radius: 6px;
            color: var(--text-color);
            text-decoration: none;
            font-size: 0.875rem;
            font-weight: 500;
            transition: all 0.3s ease;
            
            &:hover {
              transform: scale(1.05);
            }
            
            &.demo-btn:hover {
              background: var(--primary-color);
              color: white;
            }
            
            &.github-btn:hover {
              background: #333;
              color: white;
            }
          }
        }
      }
      
      .project-status {
        position: absolute;
        top: 12px;
        left: 12px;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 500;
        color: white;
        
        &.completed {
          background: #52c41a;
        }
        
        &.in-progress {
          background: #faad14;
        }
        
        &.planning {
          background: #1890ff;
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
      .project-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;
        
        .project-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-color);
          margin: 0;
          line-height: 1.4;
        }
        
        .project-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 0.75rem;
          color: var(--text-secondary);
          text-align: right;
          
          span {
            display: flex;
            align-items: center;
            gap: 4px;
          }
        }
      }
      
      .project-desc {
        color: var(--text-secondary);
        line-height: 1.6;
        margin-bottom: 16px;
        display: -webkit-box;
        /* stylelint-disable-next-line property-no-vendor-prefix */
        -webkit-line-clamp: 3;
        /* stylelint-disable-next-line property-no-vendor-prefix */
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .project-features {
        margin-bottom: 16px;
        
        h4 {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-color);
          margin: 0 0 8px;
        }
        
        ul {
          margin: 0;
          padding-left: 16px;
          
          li {
            font-size: 0.875rem;
            color: var(--text-secondary);
            line-height: 1.5;
          }
        }
      }
      
      .project-tech {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 16px;
        
        .tech-tag {
          padding: 4px 8px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
      }
      
      .project-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;
        padding-top: 16px;
        border-top: 1px solid var(--border-color);
        
        .project-stats {
          display: flex;
          gap: 16px;
          
          .stat-item {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 0.875rem;
            color: var(--text-secondary);
          }
        }
        
        .project-actions-inline {
          display: flex;
          gap: 8px;
          
          .btn {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 6px 12px;
            border-radius: 6px;
            text-decoration: none;
            font-size: 0.875rem;
            font-weight: 500;
            transition: all 0.3s ease;
            
            &.btn-primary {
              background: var(--primary-color);
              color: white;
              
              &:hover {
                background: var(--primary-color-dark);
              }
            }
            
            &.btn-outline {
              background: transparent;
              color: var(--text-secondary);
              border: 1px solid var(--border-color);
              
              &:hover {
                border-color: var(--primary-color);
                color: var(--primary-color);
              }
            }
          }
        }
      }
    }
  }
}

// 空状态
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
  
  .empty-icon {
    font-size: 64px;
    margin-bottom: 20px;
    opacity: 0.5;
  }
  
  h3 {
    font-size: 1.25rem;
    margin-bottom: 8px;
    color: var(--text-color);
  }
  
  p {
    font-size: 0.875rem;
  }
}

// 分页
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

// 响应式调整
@media (max-width: 768px) {
  .filter-section {
    position: static;
    
    .filter-controls {
      .filter-tabs {
        justify-content: center;
        
        .filter-tab {
          font-size: 0.8rem;
          padding: 6px 12px;
        }
      }
      
      .filter-actions {
        justify-content: center;
      }
    }
  }
  
  .projects-container {
    &.grid-view {
      grid-template-columns: 1fr !important;
    }
  }
}
</style>