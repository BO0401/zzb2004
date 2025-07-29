<template>
  <div class="project-detail-page">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>
    
    <!-- 项目内容 -->
    <div v-else-if="project" class="project-content">
      <!-- 项目头部 -->
      <section class="project-header">
        <div class="container">
          <div class="header-content">
            <!-- 面包屑导航 -->
            <el-breadcrumb separator="/" class="breadcrumb">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item :to="{ path: '/projects' }">项目展示</el-breadcrumb-item>
              <el-breadcrumb-item>{{ project.category }}

</el-breadcrumb-item>
              <el-breadcrumb-item class="current">{{ project.title }}

</el-breadcrumb-item>
            </el-breadcrumb>
            
            <!-- 项目信息 -->
            <div class="project-info">
              <div class="project-meta">
                <span class="category-tag">{{ project.category }}

</span>
                <span class="status-tag" :class="project.status">
                  {{ getStatusText(project.status) }}

                </span>
                <span v-if="project.featured" class="featured-tag">
                  精选项目
                </span>
              </div>
              
              <h1 class="project-title">{{ project.title }}

</h1>
              <p class="project-description">{{ project.description }}

</p>
              
              <div class="project-stats">
                <div class="stat-item">
                  <el-icon><View /></el-icon>
                  <span>{{ formatNumber(project.views) }}

 浏览</span>
                </div>
                <div class="stat-item">
                  <el-icon><Star /></el-icon>
                  <span>{{ formatNumber(project.stars) }}

 点赞</span>
                </div>
                <div class="stat-item">
                  <el-icon><Download /></el-icon>
                  <span>{{ formatNumber(project.downloads) }}

 下载</span>
                </div>
                <div class="stat-item">
                  <el-icon><Calendar /></el-icon>
                  <span>{{ formatDate(project.updatedAt) }}

</span>
                </div>
              </div>
              
              <div class="project-actions">
                <el-button 
                  type="primary" 
                  size="large"
                  @click="openLiveDemo"
                  v-if="project.demoUrl"
                >
                  <el-icon><View /></el-icon>
                  在线预览
                </el-button>
                
                <el-button 
                  size="large"
                  @click="openGithub"
                  v-if="project.githubUrl"
                >
                  <el-icon><Link /></el-icon>
                  GitHub
                </el-button>
                
                <el-button 
                  size="large"
                  @click="downloadProject"
                  v-if="project.downloadUrl"
                >
                  <el-icon><Download /></el-icon>
                  下载源码
                </el-button>
                
                <el-button 
                  size="large"
                  @click="toggleStar"
                  :loading="starring"
                >
                  <el-icon><Star /></el-icon>
                  {{ project.isStarred ? '已点赞' : '点赞' }}
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- 项目预览图 -->
      <section v-if="project.images && project.images.length > 0" class="project-gallery">
        <div class="container">
          <div class="gallery-container">
            <div class="main-image">
              <img 
                :src="project.images[currentImageIndex]" 
                :alt="project.title"
                @click="openImageViewer"
              />
            </div>
            
            <div v-if="project.images.length > 1" class="thumbnail-list">
              <div 
                v-for="(image, index) in project.images" 
                :key="index"
                class="thumbnail-item"
                :class="{ active: index === currentImageIndex }"
                @click="currentImageIndex = index"
              >
                <img :src="image" :alt="`${project.title} - ${index + 1}`" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- 主要内容区域 -->
      <section class="main-content">
        <div class="container">
          <div class="content-layout">
            <!-- 项目详情 -->
            <article class="project-details">
              <!-- 项目介绍 -->
              <div class="detail-section">
                <h2>项目介绍</h2>
                <div class="content" v-html="project.content"></div>
              </div>
              
              <!-- 技术栈 -->
              <div v-if="project.technologies && project.technologies.length > 0" class="detail-section">
                <h2>技术栈</h2>
                <div class="tech-stack">
                  <div 
                    v-for="tech in project.technologies" 
                    :key="tech.name"
                    class="tech-item"
                  >
                    <div class="tech-icon">
                      <img :src="tech.icon" :alt="tech.name" />
                    </div>
                    <div class="tech-info">
                      <h4>{{ tech.name }}

</h4>
                      <p>{{ tech.description }}

</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 功能特性 -->
              <div v-if="project.features && project.features.length > 0" class="detail-section">
                <h2>功能特性</h2>
                <div class="features-list">
                  <div 
                    v-for="feature in project.features" 
                    :key="feature.title"
                    class="feature-item"
                  >
                    <div class="feature-icon">
                      <el-icon><component :is="feature.icon" /></el-icon>
                    </div>
                    <div class="feature-content">
                      <h4>{{ feature.title }}

</h4>
                      <p>{{ feature.description }}

</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 安装使用 -->
              <div v-if="project.installation" class="detail-section">
                <h2>安装使用</h2>
                <div class="installation-guide">
                  <div class="step-list">
                    <div 
                      v-for="(step, index) in project.installation.steps" 
                      :key="index"
                      class="step-item"
                    >
                      <div class="step-number">{{ index + 1 }}

</div>
                      <div class="step-content">
                        <h4>{{ step.title }}

</h4>
                        <p>{{ step.description }}

</p>
                        <div v-if="step.code" class="code-block">
                          <pre><code>{{ step.code }}

</code></pre>
                          <el-button 
                            size="small" 
                            class="copy-btn"
                            @click="copyCode(step.code)"
                          >
                            <el-icon><DocumentCopy /></el-icon>
                          </el-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 更新日志 -->
              <div v-if="project.changelog && project.changelog.length > 0" class="detail-section">
                <h2>更新日志</h2>
                <div class="changelog-list">
                  <div 
                    v-for="log in project.changelog" 
                    :key="log.version"
                    class="changelog-item"
                  >
                    <div class="changelog-header">
                      <span class="version">v{{ log.version }}

</span>
                      <span class="date">{{ formatDate(log.date) }}

</span>
                    </div>
                    <div class="changelog-content">
                      <ul>
                        <li v-for="change in log.changes" :key="change">
                          {{ change }}

                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 标签 -->
              <div v-if="project.tags && project.tags.length > 0" class="detail-section">
                <h2>相关标签</h2>
                <div class="tags-list">
                  <el-tag 
                    v-for="tag in project.tags" 
                    :key="tag"
                    class="tag-item"
                    @click="searchByTag(tag)"
                  >
                    {{ tag }}

                  </el-tag>
                </div>
              </div>
            </article>
            
            <!-- 侧边栏 -->
            <aside class="sidebar">
              <!-- 项目信息卡片 -->
              <div class="project-info-card">
                <h4>项目信息</h4>
                <div class="info-list">
                  <div class="info-item">
                    <span class="label">项目类型</span>
                    <span class="value">{{ project.category }}

</span>
                  </div>
                  <div class="info-item">
                    <span class="label">开发时间</span>
                    <span class="value">{{ project.developmentTime }}

</span>
                  </div>
                  <div class="info-item">
                    <span class="label">项目状态</span>
                    <span class="value status" :class="project.status">
                      {{ getStatusText(project.status) }}

                    </span>
                  </div>
                  <div class="info-item">
                    <span class="label">最后更新</span>
                    <span class="value">{{ formatDate(project.updatedAt) }}

</span>
                  </div>
                  <div v-if="project.license" class="info-item">
                    <span class="label">开源协议</span>
                    <span class="value">{{ project.license }}</span>
                  </div>
                </div>
              </div>
              
              <!-- 快速链接 -->
              <div class="quick-links">
                <h4>快速链接</h4>
                <div class="links-list">
                  <a 
                    v-if="project.demoUrl" 
                    :href="project.demoUrl" 
                    target="_blank" 
                    class="link-item"
                  >
                    <el-icon><View /></el-icon>
                    <span>在线预览</span>
                    <el-icon><TopRight /></el-icon>
                  </a>
                  
                  <a 
                    v-if="project.githubUrl" 
                    :href="project.githubUrl" 
                    target="_blank" 
                    class="link-item"
                  >
                    <el-icon><Link /></el-icon>
                    <span>GitHub 仓库</span>
                    <el-icon><TopRight /></el-icon>
                  </a>
                  
                  <a 
                    v-if="project.documentUrl" 
                    :href="project.documentUrl" 
                    target="_blank" 
                    class="link-item"
                  >
                    <el-icon><Document /></el-icon>
                    <span>项目文档</span>
                    <el-icon><TopRight /></el-icon>
                  </a>
                  
                  <a 
                    v-if="project.downloadUrl" 
                    :href="project.downloadUrl" 
                    class="link-item"
                    @click="trackDownload"
                  >
                    <el-icon><Download /></el-icon>
                    <span>下载源码</span>
                    <el-icon><TopRight /></el-icon>
                  </a>
                </div>
              </div>
              
              <!-- 相关项目 -->
              <div class="related-projects">
                <h4>相关项目</h4>
                <div class="related-list">
                  <div 
                    v-for="related in relatedProjects" 
                    :key="related.id"
                    class="related-item"
                    @click="$router.push(`/projects/${related.id}`)"
                  >
                    <div class="related-image">
                      <img :src="related.cover" :alt="related.title" />
                    </div>
                    <div class="related-content">
                      <h5 class="related-title">{{ related.title }}

</h5>
                      <div class="related-meta">
                        <span class="related-category">{{ related.category }}

</span>
                        <span class="related-stars">
                          <el-icon><Star /></el-icon>
                          {{ formatNumber(related.stars) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
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
        title="项目不存在"
        sub-title="抱歉，您访问的项目不存在或已被删除"
      >
        <template #extra>
          <el-button type="primary" @click="$router.push('/projects')">
            返回项目列表
          </el-button>
        </template>
      </el-result>
    </div>
    
    <!-- 图片查看器 -->
    <el-image-viewer
      v-if="showImageViewer"
      :url-list="project?.images || []"
      :initial-index="currentImageIndex"
      @close="showImageViewer = false"
    />
    
    <!-- 回到顶部 -->
    <el-backtop :right="40" :bottom="40" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElImageViewer } from 'element-plus'
import {
  View, Star, Download, Calendar, Link, TopRight,
  Document, DocumentCopy, Check, Setting, Mobile
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(true)
const project = ref<any>(null)
const currentImageIndex = ref(0)
const showImageViewer = ref(false)

// 交互状态
const starring = ref(false)

// 相关数据
const relatedProjects = ref<any[]>([])

// 获取项目详情
const fetchProjectDetail = async () => {
  try {
    loading.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟项目数据
    project.value = {
      id: route.params.id,
      title: '个人博客系统',
      description: '基于 Vue 3 + TypeScript + Element Plus 开发的现代化个人博客系统，支持文章管理、分类标签、评论系统等功能',
      category: 'Web应用',
      status: 'completed',
      featured: true,
      views: 8420,
      stars: 156,
      downloads: 89,
      isStarred: false,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-20',
      developmentTime: '2个月',
      license: 'MIT',
      demoUrl: 'https://blog-demo.example.com',
      githubUrl: 'https://github.com/zzb2004/blog-system',
      documentUrl: 'https://docs.example.com',
      downloadUrl: 'https://github.com/zzb2004/blog-system/archive/main.zip',
      images: [
        '/project-1-1.jpg',
        '/project-1-2.jpg',
        '/project-1-3.jpg',
        '/project-1-4.jpg'
      ],
      content: `
        <p>这是一个功能完整的个人博客系统，采用现代化的前端技术栈开发。系统具有良好的用户体验和管理界面，支持响应式设计，适配各种设备。</p>
        
        <h3>主要功能</h3>
        <ul>
          <li>文章发布与管理</li>
          <li>分类和标签系统</li>
          <li>评论与回复功能</li>
          <li>用户权限管理</li>
          <li>数据统计分析</li>
          <li>SEO优化支持</li>
        </ul>
        
        <h3>技术亮点</h3>
        <ul>
          <li>采用 Vue 3 Composition API</li>
          <li>TypeScript 类型安全</li>
          <li>Pinia 状态管理</li>
          <li>Element Plus 组件库</li>
          <li>Vite 构建工具</li>
          <li>响应式设计</li>
        </ul>
      `,
      technologies: [
        {
          name: 'Vue 3',
          icon: '/tech-vue.svg',
          description: '渐进式 JavaScript 框架'
        },
        {
          name: 'TypeScript',
          icon: '/tech-typescript.svg',
          description: 'JavaScript 的超集，提供类型安全'
        },
        {
          name: 'Element Plus',
          icon: '/tech-element.svg',
          description: 'Vue 3 组件库'
        },
        {
          name: 'Pinia',
          icon: '/tech-pinia.svg',
          description: 'Vue 状态管理库'
        },
        {
          name: 'Vite',
          icon: '/tech-vite.svg',
          description: '下一代前端构建工具'
        },
        {
          name: 'Sass',
          icon: '/tech-sass.svg',
          description: 'CSS 预处理器'
        }
      ],
      features: [
        {
          icon: 'Edit',
          title: '文章管理',
          description: '支持 Markdown 编辑，实时预览，草稿保存等功能'
        },
        {
          icon: 'Collection',
          title: '分类标签',
          description: '灵活的分类和标签系统，便于内容组织和检索'
        },
        {
          icon: 'ChatDotRound',
          title: '评论系统',
          description: '支持多级评论回复，表情包，@提醒等功能'
        },
        {
          icon: 'User',
          title: '用户管理',
          description: '完整的用户注册登录，权限控制，个人资料管理'
        },
        {
          icon: 'DataAnalysis',
          title: '数据统计',
          description: '访问量统计，热门文章分析，用户行为追踪'
        },
        {
          icon: 'Mobile',
          title: '响应式设计',
          description: '完美适配桌面端、平板和移动设备'
        }
      ],
      installation: {
        steps: [
          {
            code: 'git clone https://github.com/zzb2004/blog-system.git'
          },
          {
            code: 'cd blog-system\nnpm install'
          },
          {
            code: 'cp .env.example .env\n# 编辑 .env 文件，配置数据库等信息'
          },
          {
            title: '启动项目',
            description: '启动开发服务器',
            code: 'npm run dev'
          }
        ]
      }

      },
      changelog: [
        {
          changes: [
            '新增暗黑模式支持',
            '优化移动端体验',
            '修复评论系统bug',
            '增加文章搜索功能'
          ]
        },
        {
          changes: [
            '重构前端架构，升级到 Vue 3',
            '新增 TypeScript 支持',
            '重新设计用户界面',
            '优化性能和加载速度'
          ]
        },
        {
          version: '1.5.0',
          date: '2024-01-10',
          changes: [
            '新增评论系统',
            '增加文章分享功能',
            '优化 SEO 设置',
            '修复已知问题'
          ]
        }
      ],
      tags: ['Vue 3', 'TypeScript', 'Element Plus', 'Blog', 'CMS', 'Frontend']
    }
    
    // 模拟相关项目
    relatedProjects.value = [
      {
        id: '2',
        title: 'Vue 组件库',
        cover: '/project-2.jpg',
        category: '组件库',
        stars: 89
      },
      {
        id: '3',
        title: '在线代码编辑器',
        cover: '/project-3.jpg',
        category: 'Web应用',
        stars: 67
      },
      {
        id: '4',
        title: '数据可视化大屏',
        cover: '/project-4.jpg',
        category: '可视化',
        stars: 45
      }
    ]
    
  } catch (error) {
    console.error('获取项目详情失败:', error)
    project.value = null
  }

 finally {
    loading.value = false
  }
}

// 格式化数字
const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

// 格式化日期
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

// 获取状态文本
const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    planning: '规划中',
    development: '开发中',
    completed: '已完成',
    maintenance: '维护中',
    archived: '已归档'
  }
  return map[status] || status
}

// 打开在线演示
const openLiveDemo = () => {
  if (project.value?.demoUrl) {
    window.open(project.value.demoUrl, '_blank')
    // 统计点击
    trackEvent('demo_click')
  }
}

// 打开 GitHub
const openGithub = () => {
  if (project.value?.githubUrl) {
    window.open(project.value.githubUrl, '_blank')
    // 统计点击
    trackEvent('github_click')
  }
}

// 下载项目
const downloadProject = () => {
  if (project.value?.downloadUrl) {
    const link = document.createElement('a')
    link.href = project.value.downloadUrl
    link.download = `${project.value.title}.zip`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // 统计下载
    trackDownload()
  }
}

// 点赞项目
const toggleStar = async () => {
  if (!project.value) return
  
  starring.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    project.value.isStarred = !project.value.isStarred
    project.value.stars += project.value.isStarred ? 1 : -1
    
    elmessage.success(project.value.isstarred ? '点赞成功' : '取消点赞')模拟API调用awaitnewPromiseresolvesetTimeoutproject.value.isStarred!project.value.isStarredproject.value.starsproject.value.isStarred1
  } catch (error) {
    ElMessage.error('操作失败')
  }

 finally {
    starring.value = false
  }
}

// 打开图片查看器
const openImageViewer = () => {
  showImageViewer.value = true
}

// 复制代码
const copyCode = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code)
    ElMessage.success('代码已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 根据标签搜索
const searchByTag = (tag: string) => {
  router.push({
    path: '/projects',
    query: { tag }
  })
}

// 统计事件
const trackEvent = (event: string) => {
  console.log('Track event:', event)
  // 这里可以集成统计服务
}

// 统计下载
const trackDownload = () => {
  console.log('Track download:', project.value?.title)
  // 这里可以集成统计服务
  ElMessage.success('下载开始')
}

// 监听路由变化
watch(() => route.params.id, () => {
  if (route.params.id) {
    fetchProjectDetail()
  }
}, { immediate: true })

// 组件挂载
onMounted(() => {
  // 初始化
})
</script>

<style lang="scss" scoped>
.project-detail-page {
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

// 项目头部
.project-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  
  .project-meta {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    
    .category-tag,
    .status-tag,
    .featured-tag {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    
    .category-tag {
      background: rgb(255 255 255 / 20%);
      color: white;
    }
    
    .status-tag {
      &.completed {
        background: #67c23a;
        color: white;
      }
      
      &.development {
        background: #e6a23c;
        color: white;
      }
      
      &.planning {
        background: #909399;
        color: white;
      }
    }
    
    .featured-tag {
      background: #f56c6c;
      color: white;
    }
  }
  
  .project-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 16px;
    line-height: 1.2;
    
    @media (width <= 768px) {
      font-size: 2rem;
    }
  }
  
  .project-description {
    font-size: 1.125rem;
    opacity: 0.9;
    margin-bottom: 30px;
    line-height: 1.6;
  }
  
  .project-stats {
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
  
  .project-actions {
    display: flex;
    gap: 12px;
    
    @media (width <= 768px) {
      flex-wrap: wrap;
    }
  }
}

// 项目预览图
.project-gallery {
  padding: 40px 0;
  background: var(--bg-secondary);
  
  .gallery-container {
    .main-image {
      margin-bottom: 20px;
      
      img {
        width: 100%;
        max-height: 500px;
        object-fit: cover;
        border-radius: 12px;
        cursor: pointer;
        transition: transform 0.3s ease;
        
        &:hover {
          transform: scale(1.02);
        }
      }
    }
    
    .thumbnail-list {
      display: flex;
      gap: 12px;
      overflow-x: auto;
      padding: 8px 0;
      
      .thumbnail-item {
        flex-shrink: 0;
        cursor: pointer;
        border-radius: 8px;
        overflow: hidden;
        border: 2px solid transparent;
        transition: border-color 0.3s ease;
        
        &.active {
          border-color: var(--primary-color);
        }
        
        img {
          width: 80px;
          height: 60px;
          object-fit: cover;
          display: block;
        }
      }
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

// 项目详情
.project-details {
  .detail-section {
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 30px;
    margin-bottom: 30px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-color);
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 2px solid var(--border-color);
    }
    
    .content {
      color: var(--text-secondary);
      line-height: 1.8;
      
      :deep(h3) {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-color);
        margin: 20px 0 12px;
      }
      
      :deep(ul) {
        padding-left: 20px;
        
        li {
          margin-bottom: 8px;
        }
      }
    }
  }
}

// 技术栈
.tech-stack {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  
  .tech-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: var(--bg-secondary);
    border-radius: 8px;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
    }
    
    .tech-icon {
      flex-shrink: 0;
      
      img {
        width: 40px;
        height: 40px;
        object-fit: contain;
      }
    }
    
    .tech-info {
      h4 {
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-color);
        margin-bottom: 4px;
      }
      
      p {
        font-size: 0.875rem;
        color: var(--text-secondary);
        margin: 0;
      }
    }
  }
}

// 功能特性
.features-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  
  .feature-item {
    display: flex;
    gap: 16px;
    padding: 20px;
    background: var(--bg-secondary);
    border-radius: 8px;
    
    .feature-icon {
      flex-shrink: 0;
      width: 48px;
      height: 48px;
      background: var(--primary-color);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.25rem;
    }
    
    .feature-content {
      h4 {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--text-color);
        margin-bottom: 8px;
      }
      
      p {
        font-size: 0.875rem;
        color: var(--text-secondary);
        line-height: 1.6;
        margin: 0;
      }
    }
  }
}

// 安装指南
.installation-guide {
  .step-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  .step-item {
    display: flex;
    gap: 20px;
    
    .step-number {
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      background: var(--primary-color);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
    }
    
    .step-content {
      flex: 1;
      
      h4 {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--text-color);
        margin-bottom: 8px;
      }
      
      p {
        font-size: 0.875rem;
        color: var(--text-secondary);
        margin-bottom: 12px;
      }
      
      .code-block {
        position: relative;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 16px;
        
        pre {
          margin: 0;
          font-family: 'Fira Code', monospace;
          font-size: 0.875rem;
          color: var(--text-color);
          white-space: pre-wrap;
        }
        
        .copy-btn {
          position: absolute;
          top: 8px;
          right: 8px;
        }
      }
    }
  }
}

// 更新日志
.changelog-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  .changelog-item {
    padding: 20px;
    background: var(--bg-secondary);
    border-radius: 8px;
    
    .changelog-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
      
      .version {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--primary-color);
      }
      
      .date {
        font-size: 0.875rem;
        color: var(--text-secondary);
      }
    }
    
    .changelog-content {
      ul {
        margin: 0;
        padding-left: 20px;
        
        li {
          color: var(--text-secondary);
          margin-bottom: 6px;
          
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}

// 标签
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

.project-info-card {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
  
  h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: 20px;
  }
  
  .info-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .label {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
    
    .value {
      font-size: 0.875rem;
      color: var(--text-color);
      font-weight: 500;
      
      &.status {
        &.completed {
          color: #67c23a;
        }
        
        &.development {
          color: #e6a23c;
        }
        
        &.planning {
          color: #909399;
        }
      }
    }
  }
}

.quick-links {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
  
  h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: 20px;
  }
  
  .links-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .link-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: var(--bg-secondary);
    border-radius: 8px;
    color: var(--text-color);
    text-decoration: none;
    transition: all 0.3s ease;
    
    &:hover {
      background: var(--primary-color);
      color: white;
      transform: translateX(4px);
    }
    
    span {
      flex: 1;
      font-size: 0.875rem;
    }
  }
}

.related-projects {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
  
  h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: 20px;
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
        -webkit-line-clamp: 2;
        /* stylelint-disable-next-line property-no-vendor-prefix */
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .related-meta {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 0.75rem;
        color: var(--text-secondary);
        
        .related-stars {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }
    }
  }
}
</style>