<template>
  <div class="tutorials-page">
    <!-- 页面头部 -->
    <section class="page-header">
      <div class="container">
        <div class="header-content">
          <h1 class="page-title">前端教程</h1>
          <p class="page-subtitle">系统化的前端学习资源，从基础到进阶</p>
          <div class="breadcrumb">
            <router-link to="/">首页</router-link>
            <span class="separator">/</span>
            <span class="current">教程</span>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 分类筛选 -->
    <section class="filter-section">
      <div class="container">
        <div class="filter-tabs">
          <button 
            v-for="category in categories" 
            :key="category.id"
            :class="['filter-tab', { active: activeCategory === category.id }]"
            @click="setActiveCategory(category.id)"
          >
            <component :is="category.icon" class="tab-icon" />
            {{ category.name }}
            <span class="tab-count">{{ category.count }}

</span>
          </button>
        </div>
        
        <div class="search-box">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索教程..."
            :prefix-icon="Search"
            clearable
            @input="handleSearch"
          />
        </div>
      </div>
    </section>
    
    <!-- 教程列表 -->
    <section class="tutorials-section">
      <div class="container">
        <div class="tutorials-grid" v-if="filteredTutorials.length > 0">
          <div 
            v-for="tutorial in paginatedTutorials" 
            :key="tutorial.id"
            class="tutorial-card"
            @click="goToTutorial(tutorial)"
          >
            <div class="tutorial-cover">
              <img :src="tutorial.cover" :alt="tutorial.title" />
              <div class="tutorial-level" :class="tutorial.level">
                {{ getLevelText(tutorial.level) }}

              </div>
              <div class="tutorial-category">{{ tutorial.category }}

</div>
            </div>
            <div class="tutorial-content">
              <h3 class="tutorial-title">{{ tutorial.title }}

</h3>
              <p class="tutorial-desc">{{ tutorial.description }}

</p>
              <div class="tutorial-tags">
                <span 
                  v-for="tag in tutorial.tags" 
                  :key="tag"
                  class="tag"
                >
                  {{ tag }}

                </span>
              </div>
              <div class="tutorial-meta">
                <div class="meta-left">
                  <span class="tutorial-date">
                    <el-icon><Calendar /></el-icon>
                    {{ formatDate(tutorial.date) }}

                  </span>
                  <span class="tutorial-duration">
                    <el-icon><Clock /></el-icon>
                    {{ tutorial.duration }}

                  </span>
                </div>
                <div class="meta-right">
                  <span class="tutorial-views">
                    <el-icon><View /></el-icon>
                    {{ tutorial.views }}

                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 空状态 -->
        <div v-else class="empty-state">
          <el-icon class="empty-icon"><Document /></el-icon>
          <h3>暂无相关教程</h3>
          <p>{{ searchKeyword ? '没有找到匹配的教程，请尝试其他关键词' : '该分类下暂无教程内容' }}

</p>
        </div>
        
        <!-- 分页 -->
        <div class="pagination-wrapper" v-if="totalPages > 1">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="filteredTutorials.length"
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
  Search, Calendar, Clock, View, Document
} from '@element-plus/icons-vue'

interface Tutorial {
  id: number;
  title: string;
  description: string;
  cover: string;
  category: string;
  categoryId: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  date: Date;
  duration: string;
  views: number;
  content?: string
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

// 分类数据
const categories = ref<Category[]>([
  { id: 'all', name: '全部', icon: 'Grid', count: 0 },
  { id: 'html', name: 'HTML', icon: 'Monitor', count: 0 },
  { id: 'css', name: 'CSS', icon: 'Code', count: 0 },
  { id: 'javascript', name: 'JavaScript', icon: 'Cpu', count: 0 },
  { id: 'vue', name: 'Vue', icon: 'Trophy', count: 0 }
])

// 教程数据
const tutorials = ref<Tutorial[]>([
  {
    id: 1,
    title: 'HTML5 基础入门',
    description: '从零开始学习HTML5，掌握网页结构的基本知识和语义化标签的使用',
    cover: '/tutorial-covers/html-basic.jpg',
    category: 'HTML',
    categoryId: 'html',
    level: 'beginner',
    tags: ['HTML5', '语义化', '基础'],
    date: new Date('2024-01-20'),
    duration: '2小时',
    views: 1520
  },
  {
    id: 2,
    title: 'HTML 表单与表格',
    description: '深入学习HTML表单元素和表格的创建，掌握数据收集和展示的方法',
    cover: '/tutorial-covers/html-forms.jpg',
    category: 'HTML',
    categoryId: 'html',
    level: 'intermediate',
    tags: ['表单', '表格', '数据'],
    date: new Date('2024-01-18'),
    duration: '1.5小时',
    views: 980
  },
  {
    id: 3,
    title: 'CSS3 样式基础',
    description: '学习CSS3的基本语法、选择器和常用样式属性，让网页变得美观',
    cover: '/tutorial-covers/css-basic.jpg',
    category: 'CSS',
    categoryId: 'css',
    level: 'beginner',
    tags: ['CSS3', '选择器', '样式'],
    date: new Date('2024-01-15'),
    duration: '3小时',
    views: 2340
  },
  {
    id: 4,
    title: 'CSS Flexbox 布局',
    description: '掌握Flexbox弹性布局，轻松实现各种复杂的页面布局效果',
    cover: '/tutorial-covers/css-flexbox.jpg',
    category: 'CSS',
    categoryId: 'css',
    level: 'intermediate',
    tags: ['Flexbox', '布局', '响应式'],
    date: new Date('2024-01-12'),
    duration: '2.5小时',
    views: 1890
  },
  {
    id: 5,
    title: 'CSS Grid 网格布局',
    description: '学习CSS Grid网格布局系统，构建复杂的二维布局结构',
    cover: '/tutorial-covers/css-grid.jpg',
    category: 'CSS',
    categoryId: 'css',
    level: 'advanced',
    tags: ['Grid', '网格', '二维布局'],
    date: new Date('2024-01-10'),
    duration: '3.5小时',
    views: 1456
  },
  {
    id: 6,
    title: 'JavaScript 基础语法',
    description: '学习JavaScript的基本语法、数据类型和控制结构，为编程打下基础',
    cover: '/tutorial-covers/js-basic.jpg',
    category: 'JavaScript',
    categoryId: 'javascript',
    level: 'beginner',
    tags: ['JavaScript', '语法', '基础'],
    date: new Date('2024-01-08'),
    duration: '4小时',
    views: 3210
  },
  {
    id: 7,
    title: 'JavaScript DOM 操作',
    description: '掌握DOM操作技巧，学会动态修改网页内容和样式',
    cover: '/tutorial-covers/js-dom.jpg',
    category: 'JavaScript',
    categoryId: 'javascript',
    level: 'intermediate',
    tags: ['DOM', '事件', '交互'],
    date: new Date('2024-01-05'),
    duration: '3小时',
    views: 2780
  },
  {
    id: 8,
    title: 'JavaScript ES6+ 新特性',
    description: '学习ES6及以上版本的新特性，提升JavaScript编程效率',
    cover: '/tutorial-covers/js-es6.jpg',
    category: 'JavaScript',
    categoryId: 'javascript',
    level: 'advanced',
    tags: ['ES6', '箭头函数', '模块'],
    date: new Date('2024-01-03'),
    duration: '5小时',
    views: 2156
  },
  {
    id: 9,
    title: 'Vue 3 快速入门',
    description: '快速上手Vue 3框架，学习组件化开发和响应式数据绑定',
    cover: '/tutorial-covers/vue-basic.jpg',
    category: 'Vue',
    categoryId: 'vue',
    level: 'beginner',
    tags: ['Vue3', '组件', '响应式'],
    date: new Date('2024-01-01'),
    duration: '4小时',
    views: 4520
  },
  {
    id: 10,
    title: 'Vue 3 Composition API',
    description: '深入学习Vue 3的Composition API，掌握现代Vue开发方式',
    cover: '/tutorial-covers/vue-composition.jpg',
    category: 'Vue',
    categoryId: 'vue',
    level: 'intermediate',
    tags: ['Composition API', 'setup', 'hooks'],
    date: new Date('2023-12-28'),
    duration: '3.5小时',
    views: 3890
  },
  {
    id: 11,
    title: 'Vue Router 路由管理',
    description: '学习Vue Router进行单页应用的路由管理和页面导航',
    cover: '/tutorial-covers/vue-router.jpg',
    category: 'Vue',
    categoryId: 'vue',
    level: 'intermediate',
    tags: ['Vue Router', '路由', 'SPA'],
    date: new Date('2023-12-25'),
    duration: '2.5小时',
    views: 2340
  },
  {
    id: 12,
    title: 'Pinia 状态管理',
    description: '使用Pinia进行Vue应用的状态管理，替代Vuex的现代方案',
    cover: '/tutorial-covers/vue-pinia.jpg',
    category: 'Vue',
    categoryId: 'vue',
    level: 'advanced',
    tags: ['Pinia', '状态管理', 'Store'],
    date: new Date('2023-12-22'),
    duration: '3小时',
    views: 1980
  }
])

// 计算属性
const filteredTutorials = computed(() => {
  let result = tutorials.value
  
  // 按分类筛选
  if (activeCategory.value !== 'all') {
    result = result.filter(tutorial => tutorial.categoryId === activeCategory.value)
  }
  
  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(tutorial => 
      tutorial.title.toLowerCase().includes(keyword) ||
      tutorial.description.toLowerCase().includes(keyword) ||
      tutorial.tags.some(tag => tag.toLowerCase().includes(keyword))
    )
  }
  
  return result.sort((a, b) => b.date.getTime() - a.date.getTime())
})

const totalPages = computed(() => {
  return Math.ceil(filteredTutorials.value.length / pageSize.value)
})

const paginatedTutorials = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredTutorials.value.slice(start, end)
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
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goToTutorial = (tutorial: Tutorial) => {
  router.push(`/tutorials/${tutorial.categoryId}/${tutorial.id}`)
}

const getLevelText = (level: string): string => {
  const levelMap = {
    beginner: '入门',
    intermediate: '进阶',
    advanced: '高级'
  }
  return levelMap[level as keyof typeof levelMap] || level
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
      category.count = tutorials.value.length
    } else {
      category.count = tutorials.value.filter(t => t.categoryId === category.id).length
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
.tutorials-page {
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
    justify-content: space-between;
    align-items: center;
    gap: 30px;
    
    @media (width <= 768px) {
      flex-direction: column;
      gap: 20px;
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
  
  .search-box {
    width: 300px;
    
    @media (width <= 768px) {
      width: 100%;
    }
  }
}

// 教程列表区域
.tutorials-section {
  padding: 40px 0 80px;
  
  .tutorials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 30px;
    margin-bottom: 40px;
    
    @media (width <= 768px) {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }
  
  .tutorial-card {
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
      
      .tutorial-level {
        position: absolute;
        top: 12px;
        left: 12px;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 500;
        color: white;
        
        &.beginner {
          background: #52c41a;
        }
        
        &.intermediate {
          background: #faad14;
        }
        
        &.advanced {
          background: #f5222d;
        }
      }
      
      .tutorial-category {
        position: absolute;
        top: 12px;
        right: 12px;
        background: var(--primary-color);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
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
        color: var(--text-color);
        margin-bottom: 8px;
        line-height: 1.4;
        display: -webkit-box;
        /* stylelint-disable-next-line property-no-vendor-prefix */
        -webkit-line-clamp: 2;
        /* stylelint-disable-next-line property-no-vendor-prefix */
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .tutorial-desc {
        color: var(--text-secondary);
        line-height: 1.5;
        margin-bottom: 12px;
        display: -webkit-box;
        /* stylelint-disable-next-line property-no-vendor-prefix */
        -webkit-line-clamp: 2;
        /* stylelint-disable-next-line property-no-vendor-prefix */
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .tutorial-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 16px;
        
        .tag {
          padding: 2px 6px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
      }
      
      .tutorial-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.875rem;
        color: var(--text-secondary);
        
        .meta-left {
          display: flex;
          gap: 16px;
          
          span {
            display: flex;
            align-items: center;
            gap: 4px;
          }
        }
        
        .meta-right {
          span {
            display: flex;
            align-items: center;
            gap: 4px;
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
    
    .filter-tabs {
      justify-content: center;
      
      .filter-tab {
        font-size: 0.8rem;
        padding: 6px 12px;
      }
    }
  }
  
  .tutorials-grid {
    grid-template-columns: 1fr !important;
  }
}
</style>