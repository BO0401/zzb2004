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
                  <el-icon><Star /></el-icon>
                  <span>{{ formatNumber(tutorial.likes) }}

 点赞</span>
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
              
              <div class="tutorial-actions">
                <el-button 
                  type="primary" 
                  size="large"
                  @click="toggleLike"
                  :loading="liking"
                >
                  <el-icon><Star /></el-icon>
                  {{ tutorial.isLiked ? '已点赞' : '点赞' }}

                </el-button>
                
                <el-button 
                  size="large"
                  @click="toggleBookmark"
                  :loading="bookmarking"
                >
                  <el-icon><Collection /></el-icon>
                  {{ tutorial.isBookmarked ? '已收藏' : '收藏' }}
                </el-button>
                
                <el-button 
                  size="large"
                  @click="shareArticle"
                >
                  <el-icon><Share /></el-icon>
                  分享
                </el-button>
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
                v-html="tutorial.content"
                ref="contentRef"
              ></div>
              
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
                  <router-link :to="`/tutorials/${prevTutorial.id}`" class="nav-link">
                    <el-icon><ArrowLeft /></el-icon>
                    {{ prevTutorial.title }}
                  </router-link>
                </div>
                
                <div class="nav-item next" v-if="nextTutorial">
                  <span class="nav-label">下一篇</span>
                  <router-link :to="`/tutorials/${nextTutorial.id}`" class="nav-link">
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
                  <img src="/avatar.jpg" alt="ZZB2004" />
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
                    <div class="stat">
                      <span class="stat-number">{{ formatNumber(authorStats.likes) }}</span>
                      <span class="stat-label">点赞</span>
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
      
      <!-- 评论区域 -->
      <section class="comments-section">
        <div class="container">
          <div class="comments-container">
            <h3 class="comments-title">
              评论 ({{ comments.length }})
            </h3>
            
            <!-- 评论表单 -->
            <div class="comment-form">
              <div class="form-header">
                <div class="user-avatar">
                  <img src="/avatar.jpg" alt="用户头像" />
                </div>
                <div class="form-content">
                  <el-input
                    v-model="newComment"
                    type="textarea"
                    :rows="4"
                    placeholder="写下你的评论..."
                    maxlength="500"
                    show-word-limit
                  />
                  <div class="form-actions">
                    <el-button 
                      type="primary" 
                      @click="submitComment"
                      :loading="commenting"
                      :disabled="!newComment.trim()"
                    >
                      发表评论
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 评论列表 -->
            <div class="comments-list">
              <div 
                v-for="comment in comments" 
                :key="comment.id"
                class="comment-item"
              >
                <div class="comment-avatar">
                  <img :src="comment.user.avatar" :alt="comment.user.name" />
                </div>
                <div class="comment-content">
                  <div class="comment-header">
                    <span class="comment-author">{{ comment.user.name }}

</span>
                    <span class="comment-date">{{ formatDate(comment.createdAt) }}

</span>
                  </div>
                  <div class="comment-text">{{ comment.content }}</div>
                  <div class="comment-actions">
                    <button 
                      class="action-btn"
                      @click="toggleCommentLike(comment)"
                      :class="{ liked: comment.isLiked }"
                    >
                      <el-icon><Star /></el-icon>
                      {{ comment.likes }}

                    </button>
                    <button class="action-btn" @click="replyToComment(comment)">
                      <el-icon><ChatDotRound /></el-icon>
                      回复
                    </button>
                  </div>
                  
                  <!-- 回复列表 -->
                  <div v-if="comment.replies && comment.replies.length > 0" class="replies-list">
                    <div 
                      v-for="reply in comment.replies" 
                      :key="reply.id"
                      class="reply-item"
                    >
                      <div class="reply-avatar">
                        <img :src="reply.user.avatar" :alt="reply.user.name" />
                      </div>
                      <div class="reply-content">
                        <div class="reply-header">
                          <span class="reply-author">{{ reply.user.name }}

</span>
                          <span class="reply-date">{{ formatDate(reply.createdAt) }}

</span>
                        </div>
                        <div class="reply-text">{{ reply.content }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 加载更多评论 -->
            <div v-if="hasMoreComments" class="load-more">
              <el-button @click="loadMoreComments" :loading="loadingComments">
                加载更多评论
              </el-button>
            </div>
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
import { ref, reactive, onMounted, nextTick, watch }

 from 'vue'
import { useRoute, useRouter }

 from 'vue-router'
import { ElMessage, ElMessageBox }

 from 'element-plus'
import {
  View, Star, Clock, Calendar, Collection, Share,
  ArrowLeft, ArrowRight, Plus, ChatDotRound
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(true)
const tutorial = ref<any>(null)
const tableOfContents = ref<any[]>([])
const activeSection = ref('')
const contentRef = ref<HTMLElement>()

// 交互状态
const liking = ref(false)
const bookmarking = ref(false)
const commenting = ref(false)
const loadingComments = ref(false)
const hasMoreComments = ref(true)

// 评论相关
const newComment = ref('')
const comments = ref<any[]>([])

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
const fetchTutorialDetail = async () => {
  try {
    loading.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟教程数据
    tutorial.value = {
      id: route.params.id,
      title: 'Vue 3 Composition API 完全指南',
      description: '深入学习 Vue 3 的 Composition API，掌握现代 Vue 开发的核心技能',
      category: 'Vue.js',
      difficulty: 'intermediate',
      status: 'published',
      views: 15420,
      likes: 892,
      readTime: 15,
      isLiked: false,
      isBookmarked: false,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      tags: ['Vue 3', 'Composition API', 'JavaScript', 'Frontend'],
      content: `
        <h2 id="introduction">介绍</h2>
        <p>vue 3 的 composition api 是一个全新的 api 设计，它提供了更灵活的组件逻辑组织方式...</p>
        
        <h2 id="setup-function">setup 函数</h2>
        <p>setup 函数是 composition api 的入口点...</p>
        
        <h3 id="reactive-data">响应式数据</h3>
        <p>在 composition api 中，我们使用 ref 和 reactive 来创建响应式数据...</p>
        
        <h2 id="lifecycle-hooks">生命周期钩子</h2>
        <p>composition api 提供了对应的生命周期钩子函数...</p>
        
        <h2 id="computed-watch">计算属性和监听器</h2>
        <p>computed 和 watch 在 composition api 中的使用方式...</p>
        
        <h2 id="conclusion">总结</h2>
        <p>通过本教程，你应该已经掌握了 vue 3 composition api 的核心概念...</p>
      `
    }
    
    // 模拟相关教程
    relatedTutorials.value = [
      {
        id: '2',
        title: 'Vue 3 响应式原理深度解析',
        cover: '/tutorial-2.jpg',
        views: 8900,
        createdAt: '2024-01-10'
      },
      {
        id: '3',
        title: 'Pinia 状态管理实战指南',
        cover: '/tutorial-3.jpg',
        views: 6700,
        createdAt: '2024-01-08'
      },
      {
        id: '4',
        title: 'Vue Router 4 路由配置详解',
        cover: '/tutorial-4.jpg',
        views: 5400,
        createdAt: '2024-01-05'
      }
    ]
    
    // 模拟上一篇/下一篇
    prevTutorial.value = {
      id: '0',
      title: 'Vue 3 基础入门教程'
    }
    
    nextTutorial.value = {
      id: '2',
      title: 'Vue 3 响应式原理深度解析'
    }
    
    // 模拟评论数据
    comments.value = [
      {
        id: '1',
        user: {
          name: '张三',
          avatar: '/user-1.jpg'
        },
        content: '这篇教程写得很详细，对我理解 Composition API 很有帮助！',
        likes: 12,
        isLiked: false,
        createdAt: '2024-01-21',
        replies: [
          {
            id: '1-1',
            user: {
              name: 'ZZB2004',
              avatar: '/avatar.jpg'
            },
            content: '谢谢你的反馈！很高兴这篇教程对你有帮助。',
            createdAt: '2024-01-21'
          }
        ]
      },
      {
        id: '2',
        user: {
          name: '李四',
          avatar: '/user-2.jpg'
        },
        content: '能否再详细讲解一下 computed 和 watch 的区别？',
        likes: 8,
        isLiked: false,
        createdAt: '2024-01-20',
        replies: []
      }
    ]
    
    // 生成目录
    await nextTick()
    generateTableOfContents()
    
  } catch (error) {
    console.error('获取教程详情失败:', error)
    tutorial.value = null
  }

 finally {
    loading.value = false
  }
}

// 生成目录
const generateTableOfContents = () => {
  if (!contentRef.value) return
  
  const headings = contentRef.value.querySelectorAll('h2, h3, h4')
  tableOfContents.value = Array.from(headings).map(heading => ({
    id: heading.id,
    text: heading.textContent,
    level: parseInt(heading.tagName.charAt(1))
  }))
}

// 滚动到指定章节
const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
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

// 获取难度文本
const getDifficultyText = (difficulty: string) => {
  const map: Record<string, string> = {
    beginner: '入门',
    intermediate: '中级',
    advanced: '高级'
  }
  return map[difficulty] || difficulty
}

// 获取状态文本
const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    draft: '草稿',
    published: '已发布',
    updated: '已更新'
  }
  return map[status] || status
}

// 点赞
const toggleLike = async () => {
  if (!tutorial.value) return
  
  liking.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    tutorial.value.isLiked = !tutorial.value.isLiked
    tutorial.value.likes += tutorial.value.isLiked ? 1 : -1
    
    ElMessage.success(tutorial.value.isLiked ? '点赞成功' : '取消点赞')
    
    // 模拟API调用
    await new Promise(resolve => {
      setTimeout(() => {
        tutorial.value.isLiked = !tutorial.value.isLiked
        tutorial.value.likes += tutorial.value.isLiked ? 1 : -1
        resolve(undefined)
      }, 500)
    })
  } catch (error) {
    ElMessage.error('操作失败')
  }

 finally {
    liking.value = false
  }
}

// 收藏
const toggleBookmark = async () => {
  if (!tutorial.value) return
  
  bookmarking.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    tutorial.value.isBookmarked = !tutorial.value.isBookmarked
    
    ElMessage.success(tutorial.value.isBookmarked ? '收藏成功' : '取消收藏')
  } catch (error) {
    ElMessage.error('操作失败')
  }

 finally {
    bookmarking.value = false
  }
}

// 分享文章
const shareArticle = () => {
  if (navigator.share) {
    navigator.share({
      title: tutorial.value?.title,
      text: tutorial.value?.description,
      url: window.location.href
    })
  }

 else {
    // 复制链接到剪贴板
    navigator.clipboard.writeText(window.location.href)
    ElMessage.success('链接已复制到剪贴板')
  }
}

// 根据标签搜索
const searchByTag = (tag: string) => {
  router.push({
    path: '/tutorials',
    query: { tag }
  })
}

// 提交评论
const submitComment = async () => {
  if (!newComment.value.trim()) return
  
  commenting.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const comment = {
      id: Date.now().toString(),
      user: {
        name: '当前用户',
        avatar: '/avatar.jpg'
      },
      content: newComment.value,
      likes: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
      replies: []
    }
    
    comments.value.unshift(comment)
    newComment.value = ''
    
    ElMessage.success('评论发表成功')
  } catch (error) {
    ElMessage.error('评论发表失败')
  }

 finally {
    commenting.value = false
  }
}

// 点赞评论
const toggleCommentLike = async (comment: any) => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 300))
    
    comment.isLiked = !comment.isLiked
    comment.likes += comment.isLiked ? 1 : -1
    
    // 模拟API调用
    await new Promise(resolve => {
      setTimeout(() => {
        comment.isLiked = !comment.isLiked
        comment.likes += comment.isLiked ? 1 : -1
        resolve(undefined)
      }, 500)
    })
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 回复评论
const replyToComment = (comment: any) => {
  ElMessageBox.prompt('请输入回复内容', '回复评论', {
    confirmButtonText: '发送',
    cancelButtonText: '取消',
    inputType: 'textarea'
  }).then(({ value }) => {
    if (value) {
      const reply = {
        id: Date.now().toString(),
        user: {
          name: '当前用户',
          avatar: '/avatar.jpg'
        },
        content: value,
        createdAt: new Date().toISOString()
      }
      
      if (!comment.replies) {
        comment.replies = []
      }
      comment.replies.push(reply)
      
      ElMessage.success('回复成功')
    }
  }).catch(() => {
    // 用户取消
  })
}

// 加载更多评论
const loadMoreComments = async () => {
  loadingComments.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟没有更多评论
    hasMoreComments.value = false
    ElMessage.info('没有更多评论了')
  } catch (error) {
    ElMessage.error('加载失败')
  }

 finally {
    loadingComments.value = false
  }
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
    fetchTutorialDetail()
  }
}, { immediate: true })

// 组件挂载
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
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

// 评论区域
.comments-section {
  background: var(--bg-secondary);
  padding: 60px 0;
  
  .comments-container {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .comments-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: 30px;
  }
  
  .comment-form {
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 30px;
    
    .form-header {
      display: flex;
      gap: 16px;
      
      .user-avatar {
        flex-shrink: 0;
        
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }
      }
      
      .form-content {
        flex: 1;
        
        .form-actions {
          margin-top: 12px;
          text-align: right;
        }
      }
    }
  }
  
  .comments-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-bottom: 30px;
  }
  
  .comment-item {
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 20px;
    display: flex;
    gap: 16px;
    
    .comment-avatar {
      flex-shrink: 0;
      
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
      }
    }
    
    .comment-content {
      flex: 1;
      
      .comment-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
        
        .comment-author {
          font-weight: 500;
          color: var(--text-color);
        }
        
        .comment-date {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
      }
      
      .comment-text {
        color: var(--text-secondary);
        line-height: 1.6;
        margin-bottom: 12px;
      }
      
      .comment-actions {
        display: flex;
        gap: 16px;
        
        .action-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 0.875rem;
          cursor: pointer;
          transition: color 0.3s ease;
          
          &:hover {
            color: var(--primary-color);
          }
          
          &.liked {
            color: var(--primary-color);
          }
        }
      }
      
      .replies-list {
        margin-top: 16px;
        padding-left: 20px;
        border-left: 2px solid var(--border-color);
        
        .reply-item {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
          
          &:last-child {
            margin-bottom: 0;
          }
          
          .reply-avatar {
            flex-shrink: 0;
            
            img {
              width: 32px;
              height: 32px;
              border-radius: 50%;
              object-fit: cover;
            }
          }
          
          .reply-content {
            flex: 1;
            
            .reply-header {
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 4px;
              
              .reply-author {
                font-weight: 500;
                color: var(--text-color);
                font-size: 0.875rem;
              }
              
              .reply-date {
                font-size: 0.75rem;
                color: var(--text-secondary);
              }
            }
            
            .reply-text {
              color: var(--text-secondary);
              font-size: 0.875rem;
              line-height: 1.5;
            }
          }
        }
      }
    }
  }
  
  .load-more {
    text-align: center;
  }
}
</style>