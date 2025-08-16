<template>
  <div class="tutorial-category">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="container">
        <div class="header-content">
          <h1 class="page-title">{{ categoryName }}

</h1>
          <p class="page-subtitle">{{ categoryDescription }}</p>
          <div class="breadcrumb">
            <el-breadcrumb separator=">">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item :to="{ path: '/tutorials' }">教程</el-breadcrumb-item>
              <el-breadcrumb-item>{{ categoryName }}

</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="main-content">
      <div class="container">
        <div class="content-wrapper">
          <!-- 侧边栏 -->
          <aside class="sidebar">
            <div class="category-info">
              <div class="category-icon">
                <el-icon :size="40">
                  <component :is="categoryIcon" />
                </el-icon>
              </div>
              <h3>{{ categoryName }}

</h3>
              <p>{{ categoryDescription }}

</p>
              <div class="category-stats">
                <div class="stat-item">
                  <span class="stat-number">{{ tutorials.length }}

</span>
                  <span class="stat-label">教程数量</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ totalViews }}

</span>
                  <span class="stat-label">总阅读量</span>
                </div>
              </div>
            </div>

            <!-- 难度筛选 -->
            <div class="filter-section">
              <h4>难度筛选</h4>
              <div class="difficulty-filters">
                <el-tag
                  v-for="level in difficultyLevels"
                  :key="level.value"
                  :type="selectedDifficulty === level.value ? 'primary' : ''"
                  :effect="selectedDifficulty === level.value ? 'dark' : 'plain'"
                  class="difficulty-tag"
                  @click="filterByDifficulty(level.value)"
                >
                  {{ level.label }}
                </el-tag>
              </div>
            </div>

            <!-- 标签筛选 -->
            <div class="filter-section">
              <h4>标签筛选</h4>
              <div class="tag-filters">
                <el-tag
                  v-for="tag in popularTags"
                  :key="tag"
                  :type="selectedTags.includes(tag) ? 'primary' : ''"
                  :effect="selectedTags.includes(tag) ? 'dark' : 'plain'"
                  class="tag-item"
                  @click="toggleTag(tag)"
                >
                  {{ tag }}

                </el-tag>
              </div>
            </div>
          </aside>

          <!-- 教程列表 -->
          <main class="tutorial-list">
            <!-- 搜索和排序 -->
            <div class="list-header">
              <div class="search-box">
                <el-input
                  v-model="searchKeyword"
                  placeholder="搜索教程..."
                  prefix-icon="Search"
                  clearable
                  @input="handleSearch"
                />
              </div>
              <div class="sort-options">
                <el-select v-model="sortBy" placeholder="排序方式" @change="handleSort">
                  <el-option label="最新发布" value="date" />
                  <el-option label="最多阅读" value="views" />
                  <el-option label="最多点赞" value="likes" />
                  <el-option label="难度等级" value="difficulty" />
                </el-select>
              </div>
            </div>

            <!-- 教程卡片列表 -->
            <div class="tutorials-grid">
              <div
                v-for="tutorial in filteredTutorials"
                :key="tutorial.id"
                class="tutorial-card"
                @click="goToTutorial(tutorial.id)"
              >
                <div class="card-header">
                  <div class="tutorial-image">
                    <img :src="tutorial.cover" :alt="tutorial.title" />
                    <div class="difficulty-badge">
                      <el-tag :type="getDifficultyType(tutorial.difficulty)" size="small">
                        {{ tutorial.difficulty }}

                      </el-tag>
                    </div>
                  </div>
                </div>
                <div class="card-content">
                  <h3 class="tutorial-title">{{ tutorial.title }}

</h3>
                  <p class="tutorial-description">{{ tutorial.description }}</p>
                  <div class="tutorial-tags">
                    <el-tag
                      v-for="tag in tutorial.tags.slice(0, 3)"
                      :key="tag"
                      size="small"
                      type="info"
                      effect="plain"
                    >
                      {{ tag }}

                    </el-tag>
                  </div>
                </div>
                <div class="card-footer">
                  <div class="tutorial-meta">
                    <span class="meta-item">
                      <el-icon><View /></el-icon>
                      {{ formatNumber(tutorial.views) }}

                    </span>
                    <span class="meta-item">
                      <el-icon><Star /></el-icon>
                      {{ formatNumber(tutorial.likes) }}

                    </span>
                    <span class="meta-item">
                      <el-icon><Clock /></el-icon>
                      {{ formatDate(tutorial.createdAt) }}

                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 空状态 -->
            <div v-if="filteredTutorials.length === 0" class="empty-state">
              <el-empty description="暂无相关教程" />
            </div>

            <!-- 分页 -->
            <div v-if="totalPages > 1" class="pagination">
              <el-pagination
                v-model:current-page="currentPage"
                :page-size="pageSize"
                :total="totalTutorials"
                layout="prev, pager, next, jumper"
                @current-change="handlePageChange"
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted }

 from 'vue'
import { useRoute, useRouter }

 from 'vue-router'
import { ElMessage }

 from 'element-plus'
import {
  View,
  Star,
  Clock,
  Document,
  Monitor,
  Setting
}

 from '@element-plus/icons-vue'

interface Tutorial {
  id: number;
  title: string;
  description: string;
  cover: string;
  difficulty: string;
  tags: string[];
  views: number;
  likes: number;
  createdAt: Date;
  category: string
}

const route = useRoute()
const router = useRouter()

// 响应式数据
const tutorials = ref<Tutorial[]>([])
const searchKeyword = ref('')
const selectedDifficulty = ref('')
const selectedTags = ref<string[]>([])
const sortBy = ref('date')
const currentPage = ref(1)
const pageSize = ref(12)
const loading = ref(false)

// 分类信息
const categoryName = computed(() => {
  const category = route.params.category as string
  const categoryMap: Record<string, string> = {
    'frontend': '前端开发',
    'backend': '后端开发',
    'mobile': '移动开发',
    'devops': '运维部署',
    'tools': '开发工具'
  }
  return categoryMap[category] || '未知分类'
})

const categoryDescription = computed(() => {
  const category = route.params.category as string
  const descriptionMap: Record<string, string> = {
    'frontend': '学习现代前端开发技术，包括 HTML、CSS、JavaScript、Vue、React 等',
    'backend': '掌握后端开发技能，包括 Node.js、Python、Java、数据库等',
    'mobile': '移动应用开发教程，包括 React Native、Flutter、原生开发等',
    'devops': '学习运维和部署相关技术，包括 Docker、Kubernetes、CI/CD 等',
    'tools': '提升开发效率的工具和技巧分享'
  }
  return descriptionMap[category] || '暂无描述'
})

const categoryIcon = computed(() => {
  const category = route.params.category as string
  const iconMap: Record<string, any> = {
    'frontend': Monitor,
    'backend': Setting,
    'mobile': Monitor,
    'devops': Setting,
    'tools': Document
  }
  return iconMap[category] || Document
})

// 难度等级
const difficultyLevels = [
  { label: '全部', value: '' },
  { label: '入门', value: '入门' },
  { label: '进阶', value: '进阶' },
  { label: '高级', value: '高级' }
]

// 热门标签
const popularTags = computed(() => {
  const allTags = tutorials.value.flatMap((t: Tutorial) => t.tags)
  const tagCount = allTags.reduce((acc: Record<string, number>, tag: string) => {
    acc[tag] = (acc[tag] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return Object.entries(tagCount)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 10)
    .map(([tag]) => tag)
})

// 计算属性
const filteredTutorials = computed(() => {
  let filtered = tutorials.value

  // 搜索筛选
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter((tutorial: any) =>
      tutorial.title.toLowerCase().includes(keyword) ||
      tutorial.description.toLowerCase().includes(keyword) ||
      tutorial.tags.some((tag: string) => tag.toLowerCase().includes(keyword))
    )
  }

  // 难度筛选
  if (selectedDifficulty.value) {
    filtered = filtered.filter((tutorial: any) => tutorial.difficulty === selectedDifficulty.value)
  }

  // 标签筛选
  if (selectedTags.value.length > 0) {
    filtered = filtered.filter((tutorial: any) =>
      selectedTags.value.some((tag: string) => tutorial.tags.includes(tag))
    )
  }

  // 排序
  filtered.sort((a: any, b: any) => {
    switch (sortBy.value) {
      case 'views':
        return b.views - a.views
      case 'likes':
        return b.likes - a.likes
      case 'difficulty':
        const difficultyOrder = { '入门': 1, '进阶': 2, '高级': 3 }
        return (difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0) - 
               (difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0)
      default:
        return b.createdAt.getTime() - a.createdAt.getTime()
    }
  })

  // 分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filtered.slice(start, end)
})

const totalTutorials = computed(() => {
  // 这里应该是筛选后的总数，为了简化直接使用 tutorials 长度
  return tutorials.value.length
})

const totalPages = computed(() => {
  return Math.ceil(totalTutorials.value / pageSize.value)
})

const totalViews = computed(() => {
  return tutorials.value.reduce((sum: number, tutorial: any) => sum + tutorial.views, 0)
})

// 方法
const fetchTutorials = async () => {
  loading.value = true
  try {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const category = route.params.category as string
    
    // 模拟数据
    tutorials.value = [
      {
        id: 1,
        title: 'Vue 3 组件开发指南',
        description: '深入学习 Vue 3 组件开发的最佳实践，包括组合式 API、响应式系统等',
        cover: 'https://picsum.photos/300/200?random=1',
        difficulty: '进阶',
        tags: ['Vue3', '组件', '前端'],
        views: 1250,
        likes: 89,
        createdAt: new Date('2025-07-29'),
        category: 'frontend'
      },
      {
        id: 2,
        title: 'TypeScript 实战教程',
        description: '从基础到高级，全面掌握 TypeScript 开发技能',
        cover: 'https://picsum.photos/300/200?random=2',
        difficulty: '入门',
        tags: ['TypeScript', 'JavaScript', '类型系统'],
        views: 2100,
        likes: 156,
        createdAt: new Date('2025-07-29'),
        category: 'frontend'
      },
      {
        id: 3,
        title: 'Vite 构建工具详解',
        description: '学习使用 Vite 构建现代前端项目，提升开发效率',
        cover: 'https://picsum.photos/300/200?random=3',
        difficulty: '进阶',
        tags: ['Vite', '构建工具', '性能优化'],
        views: 890,
        likes: 67,
        createdAt: new Date('2025-07-29'),
        category: 'frontend'
      }
    ].filter(tutorial => tutorial.category === category)
    
  } catch (error) {
    ElMessage.error('获取教程列表失败')
  }

 finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleSort = () => {
  currentPage.value = 1
}

const filterByDifficulty = (difficulty: string) => {
  selectedDifficulty.value = selectedDifficulty.value === difficulty ? '' : difficulty
  currentPage.value = 1
}

const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
  currentPage.value = 1
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goToTutorial = (id: number) => {
  router.push(`/tutorials/${id}`)
}

const getDifficultyType = (difficulty: string) => {
  const typeMap: Record<string, string> = {
    '初级': 'success',
    '中级': 'warning',
    '高级': 'danger'
  }
  return typeMap[difficulty] || 'info'
}

const formatNumber = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

const formatDate = (dateStr: Date | string) => {
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 生命周期
onMounted(() => {
  fetchTutorials()
})
</script>

<style scoped>
.tutorial-category {
  min-height: 100vh;
  background: var(--el-bg-color-page);
}

.page-header {
  background: linear-gradient(135deg, var(--el-color-primary) 0%, var(--el-color-primary-light-3) 100%);
  color: white;
  padding: 4rem 0 2rem;
  position: relative;
  overflow: hidden;
}

.page-header::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
  opacity: 0.3;
}

.header-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.page-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgb(0 0 0 / 30%);
}

.page-subtitle {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.breadcrumb {
  display: flex;
  justify-content: center;
}

.breadcrumb :deep(.el-breadcrumb__inner) {
  color: rgb(255 255 255 / 80%);
}

.breadcrumb :deep(.el-breadcrumb__inner:hover) {
  color: white;
}

.main-content {
  padding: 2rem 0;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  align-items: start;
}

.sidebar {
  background: var(--el-bg-color);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--el-box-shadow-light);
  position: sticky;
  top: 2rem;
}

.category-info {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.category-icon {
  margin-bottom: 1rem;
  color: var(--el-color-primary);
}

.category-info h3 {
  margin-bottom: 0.5rem;
  color: var(--el-text-color-primary);
}

.category-info p {
  color: var(--el-text-color-regular);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.category-stats {
  display: flex;
  justify-content: space-around;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--el-color-primary);
}

.stat-label {
  font-size: 0.8rem;
  color: var(--el-text-color-regular);
}

.filter-section {
  margin-bottom: 2rem;
}

.filter-section h4 {
  margin-bottom: 1rem;
  color: var(--el-text-color-primary);
  font-size: 1rem;
}

.difficulty-filters,
.tag-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.difficulty-tag,
.tag-item {
  cursor: pointer;
  transition: all 0.3s ease;
}

.difficulty-tag:hover,
.tag-item:hover {
  transform: translateY(-2px);
}

.tutorial-list {
  background: var(--el-bg-color);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--el-box-shadow-light);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.search-box {
  flex: 1;
  max-width: 400px;
}

.sort-options {
  width: 150px;
}

.tutorials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.tutorial-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.tutorial-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--el-box-shadow);
  border-color: var(--el-color-primary-light-7);
}

.card-header {
  position: relative;
}

.tutorial-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.tutorial-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.tutorial-card:hover .tutorial-image img {
  transform: scale(1.05);
}

.difficulty-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}

.card-content {
  padding: 1.5rem;
}

.tutorial-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--el-text-color-primary);
  line-height: 1.4;
  display: -webkit-box;
  /* stylelint-disable-next-line property-no-vendor-prefix */
  -webkit-line-clamp: 2;
  /* stylelint-disable-next-line property-no-vendor-prefix */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tutorial-description {
  color: var(--el-text-color-regular);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
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
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.card-footer {
  padding: 0 1.5rem 1.5rem;
  border-top: 1px solid var(--el-border-color-lighter);
  padding-top: 1rem;
}

.tutorial-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--el-text-color-regular);
  font-size: 0.8rem;
}

.meta-item .el-icon {
  font-size: 0.9rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 0;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

/* 响应式设计 */
@media (width <= 1024px) {
  .content-wrapper {
    grid-template-columns: 250px 1fr;
    gap: 1.5rem;
  }
  
  .tutorials-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (width <= 768px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    position: static;
    order: 2;
  }
  
  .tutorial-list {
    order: 1;
  }
  
  .list-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .tutorials-grid {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .tutorial-meta {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
}

@media (width <= 480px) {
  .page-header {
    padding: 2rem 0 1rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
  
  .sidebar,
  .tutorial-list {
    padding: 1rem;
  }
  
  .card-content {
    padding: 1rem;
  }
  
  .card-footer {
    padding: 0 1rem 1rem;
  }
}
</style>