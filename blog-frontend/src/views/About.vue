<template>
  <div class="about-page">
    <!-- 页面头部 -->
    <section class="page-header">
      <div class="container">
        <div class="header-content">
          <div class="avatar-section">
            <div class="avatar-container">
              <img src="/avatar.svg" alt="ZZB2004" class="avatar-img" />
              <div class="avatar-ring"></div>
            </div>
          </div>
          <div class="intro-section">
            <h1 class="page-title">关于我</h1>
            <p class="page-subtitle">一名热爱前端开发的学习者</p>
            <div class="social-links">
              <a href="https://github.com/zzb2004" target="_blank" class="social-link github">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
              <a href="mailto:zzb2004@example.com" class="social-link email">
                <el-icon><Message /></el-icon>
                邮箱
              </a>
              <a href="https://blog.zzb2004.com" target="_blank" class="social-link blog">
                <el-icon><Link /></el-icon>
                博客
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 个人介绍 -->
    <section class="intro-section">
      <div class="container">
        <div class="intro-content">
          <div class="intro-text">
            <h2 class="section-title">个人简介</h2>
            <div class="intro-paragraphs">
              <p>
                你好！我是 <strong>ZZB2004</strong>，一名热爱前端开发的学习者。
                我对Web技术充满热情，喜欢探索新的技术栈，并将所学知识分享给更多的人。
              </p>
              <p>
                在前端开发的道路上，我专注于学习现代化的开发技术，包括 Vue.js、React、TypeScript 等。
                我相信技术的力量能够改变世界，也希望通过自己的努力为开源社区贡献一份力量。
              </p>
              <p>
                除了编程，我还喜欢阅读技术博客、参与开源项目，以及与其他开发者交流学习心得。
                我认为分享是最好的学习方式，因此创建了这个网站来记录和分享我的学习历程。
              </p>
            </div>
          </div>
          <div class="intro-stats">
            <div class="stat-card" v-for="stat in personalStats" :key="stat.label">
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
      </div>
    </section>
    
    <!-- 技能展示 -->
    <section class="skills-section">
      <div class="container">
        <h2 class="section-title">技能专长</h2>
        <div class="skills-grid">
          <div class="skill-category" v-for="category in skillCategories" :key="category.name">
            <h3 class="category-title">
              <component :is="category.icon" class="category-icon" />
              {{ category.name }}

            </h3>
            <div class="skills-list">
              <div 
                v-for="skill in category.skills" 
                :key="skill.name"
                class="skill-item"
              >
                <div class="skill-header">
                  <span class="skill-name">{{ skill.name }}

</span>
                  <span class="skill-level">{{ skill.level }}%</span>
                </div>
                <div class="skill-bar">
                  <div 
                    class="skill-progress"
                    :style="{ width: skill.level + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 学习历程 -->
    <section class="timeline-section">
      <div class="container">
        <h2 class="section-title">学习历程</h2>
        <div class="timeline">
          <div 
            v-for="(item, index) in timelineItems" 
            :key="index"
            class="timeline-item"
          >
            <div class="timeline-marker">
              <component :is="item.icon" />
            </div>
            <div class="timeline-content">
              <div class="timeline-date">{{ item.date }}

</div>
              <h3 class="timeline-title">{{ item.title }}

</h3>
              <p class="timeline-desc">{{ item.description }}

</p>
              <div class="timeline-tags" v-if="item.tags">
                <span 
                  v-for="tag in item.tags" 
                  :key="tag"
                  class="timeline-tag"
                >
                  {{ tag }}

                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 兴趣爱好 -->
    <section class="interests-section">
      <div class="container">
        <h2 class="section-title">兴趣爱好</h2>
        <div class="interests-grid">
          <div 
            v-for="interest in interests" 
            :key="interest.name"
            class="interest-card"
          >
            <div class="interest-icon">
              <component :is="interest.icon" />
            </div>
            <h3 class="interest-name">{{ interest.name }}

</h3>
            <p class="interest-desc">{{ interest.description }}

</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 联系方式 -->
    <section class="contact-section">
      <div class="container">
        <div class="contact-content">
          <div class="contact-info">
            <h2 class="section-title">联系我</h2>
            <p class="contact-desc">
              如果你对我的项目感兴趣，或者想要交流学习心得，
              欢迎通过以下方式联系我。我很乐意与你分享和讨论技术相关的话题。
            </p>
            <div class="contact-methods">
              <div class="contact-method" v-for="method in contactMethods" :key="method.type">
                <div class="method-icon">
                  <component :is="method.icon" />
                </div>
                <div class="method-content">
                  <div class="method-label">{{ method.label }}

</div>
                  <div class="method-value">
                    <a v-if="method.link" :href="method.link" target="_blank">
                      {{ method.value }}

                    </a>
                    <span v-else>{{ method.value }}

</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="contact-form">
            <h3>快速留言</h3>
            <el-form :model="messageForm" label-position="top">
              <el-form-item label="姓名">
                <el-input v-model="messageForm.name" placeholder="请输入您的姓名" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="messageForm.email" placeholder="请输入您的邮箱" />
              </el-form-item>
              <el-form-item label="主题">
                <el-input v-model="messageForm.subject" placeholder="请输入留言主题" />
              </el-form-item>
              <el-form-item label="留言内容">
                <el-input 
                  v-model="messageForm.message" 
                  type="textarea" 
                  :rows="4"
                  placeholder="请输入您的留言内容"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitMessage" :loading="submitting">
                  发送留言
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive }

 from 'vue'
import { ElMessage }

 from 'element-plus'
import {
  Message, Link
} from '@element-plus/icons-vue'

// 个人统计数据
const personalStats = ref([
  {
    icon: 'Calendar',
    value: '2+',
    label: '学习年限'
  },
  {
    icon: 'Code',
    value: '50+',
    label: '项目经验'
  },
  {
    icon: 'Book',
    value: '100+',
    label: '学习笔记'
  },
  {
    icon: 'Star',
    value: '1000+',
    label: 'GitHub Stars'
  }
])

// 技能分类
const skillCategories = ref([
  {
    name: '前端技术',
    icon: 'Monitor',
    skills: [
      { name: 'HTML5', level: 90 },
      { name: 'CSS3', level: 85 },
      { name: 'JavaScript', level: 80 },
      { name: 'TypeScript', level: 75 },
      { name: 'Vue.js', level: 85 },
      { name: 'React', level: 70 }
    ]
  },
  {
    name: '开发工具',
    icon: 'Code',
    skills: [
      { name: 'Git', level: 80 },
      { name: 'Webpack', level: 70 },
      { name: 'Vite', level: 85 },
      { name: 'ESLint', level: 75 },
      { name: 'Prettier', level: 80 },
      { name: 'VS Code', level: 90 }
    ]
  },
  {
    name: '后端技术',
    icon: 'Cpu',
    skills: [
      { name: 'Node.js', level: 65 },
      { name: 'Express', level: 60 },
      { name: 'MySQL', level: 55 },
      { name: 'MongoDB', level: 50 },
      { name: 'RESTful API', level: 70 },
      { name: 'GraphQL', level: 45 }
    ]
  },
  {
    name: '其他技能',
    icon: 'Trophy',
    skills: [
      { name: 'UI/UX设计', level: 60 },
      { name: 'Figma', level: 65 },
      { name: 'Photoshop', level: 55 },
      { name: '技术写作', level: 75 },
      { name: '项目管理', level: 60 },
      { name: '团队协作', level: 80 }
    ]
  }
])

// 学习历程
const timelineItems = ref([
  {
    date: '2024年1月',
    title: '深入学习Vue 3生态',
    description: '系统学习Vue 3 Composition API、Pinia状态管理、Vue Router等技术栈，并开始构建个人项目。',
    icon: 'Trophy',
    tags: ['Vue 3', 'Pinia', 'TypeScript']
  },
  {
    date: '2023年10月',
    title: '开始前端进阶学习',
    description: '学习现代前端工程化工具，包括Webpack、Vite、ESLint等，提升开发效率和代码质量。',
    icon: 'Code',
    tags: ['Webpack', 'Vite', '工程化']
  },
  {
    date: '2023年6月',
    title: '掌握JavaScript核心',
    description: '深入学习JavaScript ES6+新特性、异步编程、模块化等核心概念，为后续学习打下坚实基础。',
    icon: 'Cpu',
    tags: ['JavaScript', 'ES6+', '异步编程']
  },
  {
    date: '2023年3月',
    title: '学习CSS高级特性',
    description: '掌握CSS3动画、Flexbox、Grid布局等高级特性，能够实现复杂的页面布局和交互效果。',
    icon: 'Monitor',
    tags: ['CSS3', 'Flexbox', 'Grid']
  },
  {
    date: '2022年12月',
    title: '前端开发入门',
    description: '开始学习HTML、CSS、JavaScript基础知识，完成第一个静态网页项目，正式踏入前端开发领域。',
    icon: 'Star',
    tags: ['HTML', 'CSS', 'JavaScript']
  }
])

// 兴趣爱好
const interests = ref([
  {
    name: '编程学习',
    icon: 'Code',
    description: '热爱学习新的编程技术和框架，享受解决问题的过程'
  },
  {
    name: '开源贡献',
    icon: 'Trophy',
    description: '积极参与开源项目，为社区贡献代码和文档'
  },
  {
    name: '技术写作',
    icon: 'Book',
    description: '喜欢写技术博客，分享学习心得和项目经验'
  },
  {
    name: '摄影',
    icon: 'Camera',
    description: '用镜头记录生活中的美好瞬间，培养审美能力'
  },
  {
    name: '音乐',
    icon: 'Music',
    description: '听音乐放松心情，偶尔也会尝试创作简单的旋律'
  },
  {
    name: '游戏',
    icon: 'Game',
    description: '适度游戏娱乐，也会关注游戏开发相关技术'
  }
])

// 联系方式
const contactMethods = ref([
  {
    type: 'email',
    label: '邮箱',
    value: 'zzb2004@example.com',
    icon: 'Message',
    link: 'mailto:zzb2004@example.com'
  },
  {
    type: 'github',
    label: 'GitHub',
    value: 'github.com/zzb2004',
    icon: 'Link',
    link: 'https://github.com/zzb2004'
  },
  {
    type: 'location',
    label: '位置',
    value: '中国',
    icon: 'Location'
  },
  {
    type: 'timezone',
    label: '时区',
    value: 'UTC+8',
    icon: 'Clock'
  }
])

// 留言表单
const messageForm = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const submitting = ref(false)

// 提交留言
const submitMessage = async () => {
  if (!messageForm.name || !messageForm.email || !messageForm.message) {
    ElMessage.warning('请填写完整信息')
    return
  }
  
  submitting.value = true
  
  try {
    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('留言发送成功！我会尽快回复您。')
    
    // 重置表单
    Object.assign(messageForm, {
      name: '',
      email: '',
      subject: '',
      message: ''
    })
  } catch (error) {
    ElMessage.error('发送失败，请稍后重试')
  }

 finally {
    submitting.value = false
  }
}

</script>

<style lang="scss" scoped>
.about-page {
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
  padding: 80px 0;
  
  .header-content {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 40px;
    align-items: center;
    
    @media (width <= 768px) {
      grid-template-columns: 1fr;
      text-align: center;
      gap: 30px;
    }
  }
  
  .avatar-section {
    .avatar-container {
      position: relative;
      
      .avatar-img {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        object-fit: cover;
        border: 4px solid rgb(255 255 255 / 30%);
        position: relative;
        z-index: 2;
      }
      
      .avatar-ring {
        position: absolute;
        inset: -8px;
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
  
  .intro-section {
    .page-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 12px;
      
      @media (width <= 768px) {
        font-size: 2rem;
      }
    }
    
    .page-subtitle {
      font-size: 1.25rem;
      opacity: 0.9;
      margin-bottom: 30px;
    }
    
    .social-links {
      display: flex;
      gap: 16px;
      
      @media (width <= 768px) {
        justify-content: center;
      }
      
      .social-link {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background: rgb(255 255 255 / 20%);
        border: 1px solid rgb(255 255 255 / 30%);
        border-radius: 20px;
        color: white;
        text-decoration: none;
        font-size: 0.875rem;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        
        &:hover {
          background: rgb(255 255 255 / 30%);
          transform: translateY(-2px);
        }
      }
    }
  }
}

// 通用区域样式
section {
  padding: 80px 0;
  
  @media (width <= 768px) {
    padding: 60px 0;
  }
  
  &:nth-child(even) {
    background: var(--bg-secondary);
  }
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 60px;
  color: var(--text-color);
  
  @media (width <= 768px) {
    font-size: 2rem;
    margin-bottom: 40px;
  }
}

// 个人介绍
.intro-section {
  .intro-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 60px;
    align-items: start;
    
    @media (width <= 768px) {
      grid-template-columns: 1fr;
      gap: 40px;
    }
  }
  
  .intro-text {
    .section-title {
      text-align: left;
      margin-bottom: 30px;
      
      @media (width <= 768px) {
        text-align: center;
      }
    }
    
    .intro-paragraphs {
      p {
        font-size: 1.125rem;
        line-height: 1.8;
        color: var(--text-secondary);
        margin-bottom: 20px;
        
        strong {
          color: var(--primary-color);
          font-weight: 600;
        }
      }
    }
  }
  
  .intro-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    
    @media (width <= 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .stat-card {
      background: var(--bg-color);
      padding: 24px;
      border-radius: 12px;
      border: 1px solid var(--border-color);
      text-align: center;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow);
      }
      
      .stat-icon {
        width: 48px;
        height: 48px;
        background: linear-gradient(45deg, var(--primary-color), #667eea);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px;
        color: white;
        font-size: 20px;
      }
      
      .stat-number {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-color);
        margin-bottom: 4px;
      }
      
      .stat-label {
        font-size: 0.875rem;
        color: var(--text-secondary);
      }
    }
  }
}

// 技能展示
.skills-section {
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 40px;
  }
  
  .skill-category {
    .category-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-color);
      margin-bottom: 24px;
      
      .category-icon {
        width: 24px;
        height: 24px;
        color: var(--primary-color);
      }
    }
    
    .skills-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .skill-item {
      .skill-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        
        .skill-name {
          font-weight: 500;
          color: var(--text-color);
        }
        
        .skill-level {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
      }
      
      .skill-bar {
        height: 6px;
        background: var(--bg-secondary);
        border-radius: 3px;
        overflow: hidden;
        
        .skill-progress {
          height: 100%;
          background: linear-gradient(90deg, var(--primary-color), #667eea);
          border-radius: 3px;
          transition: width 1s ease;
        }
      }
    }
  }
}

// 学习历程
.timeline-section {
  .timeline {
    position: relative;
    max-width: 800px;
    margin: 0 auto;
    
    &::before {
      content: '';
      position: absolute;
      left: 30px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: var(--border-color);
      
      @media (width <= 768px) {
        left: 20px;
      }
    }
  }
  
  .timeline-item {
    position: relative;
    padding-left: 80px;
    margin-bottom: 40px;
    
    @media (width <= 768px) {
      padding-left: 60px;
    }
    
    .timeline-marker {
      position: absolute;
      left: 18px;
      top: 8px;
      width: 24px;
      height: 24px;
      background: var(--primary-color);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
      
      @media (width <= 768px) {
        left: 8px;
      }
    }
    
    .timeline-content {
      background: var(--bg-color);
      padding: 24px;
      border-radius: 12px;
      border: 1px solid var(--border-color);
      
      .timeline-date {
        font-size: 0.875rem;
        color: var(--primary-color);
        font-weight: 500;
        margin-bottom: 8px;
      }
      
      .timeline-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--text-color);
        margin-bottom: 8px;
      }
      
      .timeline-desc {
        color: var(--text-secondary);
        line-height: 1.6;
        margin-bottom: 12px;
      }
      
      .timeline-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        
        .timeline-tag {
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
}

// 兴趣爱好
.interests-section {
  .interests-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
  }
  
  .interest-card {
    background: var(--bg-color);
    padding: 30px 20px;
    border-radius: 12px;
    border: 1px solid var(--border-color);
    text-align: center;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow);
      border-color: var(--primary-color);
    }
    
    .interest-icon {
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
    
    .interest-name {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-color);
      margin-bottom: 12px;
    }
    
    .interest-desc {
      color: var(--text-secondary);
      line-height: 1.6;
      font-size: 0.875rem;
    }
  }
}

// 联系方式
.contact-section {
  .contact-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    
    @media (width <= 768px) {
      grid-template-columns: 1fr;
      gap: 40px;
    }
  }
  
  .contact-info {
    .section-title {
      text-align: left;
      margin-bottom: 20px;
      
      @media (width <= 768px) {
        text-align: center;
      }
    }
    
    .contact-desc {
      font-size: 1.125rem;
      line-height: 1.8;
      color: var(--text-secondary);
      margin-bottom: 40px;
    }
    
    .contact-methods {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .contact-method {
      display: flex;
      align-items: center;
      gap: 16px;
      
      .method-icon {
        width: 48px;
        height: 48px;
        background: var(--bg-secondary);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary-color);
        font-size: 20px;
      }
      
      .method-content {
        .method-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: 4px;
        }
        
        .method-value {
          font-weight: 500;
          color: var(--text-color);
          
          a {
            color: var(--primary-color);
            text-decoration: none;
            
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
  
  .contact-form {
    background: var(--bg-color);
    padding: 40px;
    border-radius: 12px;
    border: 1px solid var(--border-color);
    
    h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-color);
      margin-bottom: 24px;
      text-align: center;
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
</style>