<template>
  <div class="error-page">
    <div class="error-container">
      <div class="error-content">
        <!-- 404 图标 -->
        <div class="error-icon">
          <div class="number-404">
            <span class="four">4</span>
            <span class="zero">0</span>
            <span class="four">4</span>
          </div>
          <div class="error-illustration">
            <svg viewBox="0 0 200 200" class="illustration-svg">
              <!-- 背景圆 -->
              <circle cx="100" cy="100" r="80" fill="var(--el-color-primary-light-9)" opacity="0.3"/>
              
              <!-- 搜索图标 -->
              <g transform="translate(70, 70)">
                <circle cx="20" cy="20" r="15" stroke="var(--el-color-primary)" stroke-width="3" fill="none"/>
                <line x1="32" y1="32" x2="45" y2="45" stroke="var(--el-color-primary)" stroke-width="3" stroke-linecap="round"/>
              </g>
              
              <!-- 问号 -->
              <g transform="translate(120, 70)">
                <circle cx="15" cy="15" r="12" fill="var(--el-color-warning)"/>
                <text x="15" y="20" text-anchor="middle" fill="white" font-size="14" font-weight="bold">?</text>
              </g>
              
              <!-- 装饰元素 -->
              <circle cx="60" cy="140" r="3" fill="var(--el-color-success)" opacity="0.6"/>
              <circle cx="140" cy="130" r="4" fill="var(--el-color-danger)" opacity="0.6"/>
              <circle cx="160" cy="160" r="2" fill="var(--el-color-info)" opacity="0.6"/>
            </svg>
          </div>
        </div>

        <!-- 错误信息 -->
        <div class="error-info">
          <h1 class="error-title">页面未找到</h1>
          <p class="error-description">
            抱歉，您访问的页面不存在或已被移动。
            <br>
            请检查网址是否正确，或返回首页继续浏览。
          </p>
        </div>

        <!-- 操作按钮 -->
        <div class="error-actions">
          <el-button type="primary" size="large" @click="goHome">
            <el-icon><House /></el-icon>
            返回首页
          </el-button>
          <el-button size="large" @click="goHome">
            <el-icon><ArrowLeft /></el-icon>
            返回上页
          </el-button>
          <el-button size="large" @click="goHome">
            <el-icon><Search /></el-icon>
            搜索内容
          </el-button>
        </div>

        <!-- 推荐链接 -->
        <div class="helpful-links">
          <h3>您可能感兴趣的内容：</h3>
          <div class="links-grid">
            <router-link to="/tutorials" class="link-card">
              <el-icon><Document /></el-icon>
              <span>前端教程</span>
            </router-link>
            <router-link to="/projects" class="link-card">
              <el-icon><Folder /></el-icon>
              <span>项目展示</span>
            </router-link>
            <router-link to="/about" class="link-card">
              <el-icon><User /></el-icon>
              <span>关于我</span>
            </router-link>
            <router-link to="/contact" class="link-card">
              <el-icon><Message /></el-icon>
              <span>联系我</span>
            </router-link>
          </div>
        </div>

        <!-- 搜索框 -->
        <div class="search-section">
          <h3>搜索您需要的内容：</h3>
          <div class="search-box">
            <el-input
              v-model="searchKeyword"
              placeholder="输入关键词搜索..."
              size="large"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
              <template #append>
                <el-button type="primary" @click="handleSearch">
                  搜索
                </el-button>
              </template>
            </el-input>
          </div>
          <div class="search-suggestions">
            <span class="suggestion-label">热门搜索：</span>
            <el-tag
              v-for="tag in popularSearches"
              :key="tag"
              class="search-tag"
              @click="searchKeyword = tag; handleSearch()"
            >
              {{ tag }}

            </el-tag>
          </div>
        </div>
      </div>

      <!-- 背景装饰 -->
      <div class="background-decoration">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
        <div class="floating-shape shape-4"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref }

 from 'vue'
import { useRouter }

 from 'vue-router'
import { ElMessage }

 from 'element-plus'
import {
  House,
  ArrowLeft,
  Search,
  Document,
  Folder,
  User,
  Message
} from '@element-plus/icons-vue'

const router = useRouter()

// 响应式数据
const searchKeyword = ref('')

// 热门搜索词
const popularSearches = [
  'Vue3',
  'TypeScript',
  'JavaScript',
  'CSS',
  'React',
  'Node.js',
  '前端框架',
  '项目实战'
]

// 方法
const goHome = () => {
  router.push('/')
}



const handleSearch = () => {
  if (!searchKeyword.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  
  // 这里可以跳转到搜索结果页面
  router.push({
    path: '/tutorials',
    query: { search: searchKeyword.value }
  })
}

</script>

<style scoped>
.error-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--el-bg-color-page) 0%, var(--el-color-primary-light-9) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.error-container {
  max-width: 800px;
  width: 100%;
  position: relative;
  z-index: 1;
}

.error-content {
  text-align: center;
  background: var(--el-bg-color);
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 20px 40px rgb(0 0 0 / 10%);
  backdrop-filter: blur(10px);
}

.error-icon {
  margin-bottom: 2rem;
}

.number-404 {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.number-404 span {
  font-size: 6rem;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-primary-light-3));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: bounce 2s infinite;
}

.number-404 .zero {
  animation-delay: 0.2s;
}

.number-404 .four:last-child {
  animation-delay: 0.4s;
}

.error-illustration {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.illustration-svg {
  width: 150px;
  height: 150px;
  animation: float 3s ease-in-out infinite;
}

.error-info {
  margin-bottom: 3rem;
}

.error-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--el-text-color-primary);
  margin-bottom: 1rem;
}

.error-description {
  font-size: 1.1rem;
  color: var(--el-text-color-regular);
  line-height: 1.6;
  max-width: 500px;
  margin: 0 auto;
}

.error-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.helpful-links {
  margin-bottom: 3rem;
}

.helpful-links h3 {
  font-size: 1.3rem;
  color: var(--el-text-color-primary);
  margin-bottom: 1.5rem;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

.link-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem 1rem;
  background: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  text-decoration: none;
  color: var(--el-text-color-primary);
  transition: all 0.3s ease;
}

.link-card:hover {
  background: var(--el-color-primary-light-9);
  border-color: var(--el-color-primary-light-7);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgb(0 0 0 / 10%);
}

.link-card .el-icon {
  font-size: 1.5rem;
  color: var(--el-color-primary);
}

.link-card span {
  font-weight: 500;
}

.search-section {
  text-align: center;
}

.search-section h3 {
  font-size: 1.3rem;
  color: var(--el-text-color-primary);
  margin-bottom: 1.5rem;
}

.search-box {
  max-width: 500px;
  margin: 0 auto 1.5rem;
}

.search-suggestions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.suggestion-label {
  color: var(--el-text-color-regular);
  font-size: 0.9rem;
}

.search-tag {
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-tag:hover {
  background: var(--el-color-primary);
  color: white;
  transform: translateY(-1px);
}

.background-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 100px;
  height: 100px;
  background: var(--el-color-primary);
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  background: var(--el-color-success);
  top: 20%;
  right: 10%;
  animation-delay: 1s;
}

.shape-3 {
  width: 80px;
  height: 80px;
  background: var(--el-color-warning);
  bottom: 20%;
  left: 20%;
  animation-delay: 2s;
}

.shape-4 {
  width: 120px;
  height: 120px;
  background: var(--el-color-danger);
  bottom: 10%;
  right: 20%;
  animation-delay: 3s;
}

/* 动画 */
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }

  40% {
    transform: translateY(-10px);
  }

  60% {
    transform: translateY(-5px);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }

  33% {
    transform: translateY(-10px) rotate(120deg);
  }

  66% {
    transform: translateY(5px) rotate(240deg);
  }
}

/* 响应式设计 */
@media (width <= 768px) {
  .error-content {
    padding: 2rem 1.5rem;
  }
  
  .number-404 span {
    font-size: 4rem;
  }
  
  .error-title {
    font-size: 2rem;
  }
  
  .error-description {
    font-size: 1rem;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .error-actions .el-button {
    width: 100%;
    max-width: 200px;
  }
  
  .links-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .search-suggestions {
    justify-content: center;
  }
}

@media (width <= 480px) {
  .error-page {
    padding: 1rem;
  }
  
  .error-content {
    padding: 1.5rem 1rem;
  }
  
  .number-404 span {
    font-size: 3rem;
  }
  
  .error-title {
    font-size: 1.5rem;
  }
  
  .links-grid {
    grid-template-columns: 1fr;
  }
  
  .illustration-svg {
    width: 120px;
    height: 120px;
  }
}
</style>