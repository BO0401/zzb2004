<template>
  <div class="contact-page">
    <!-- 页面头部 -->
    <section class="page-header">
      <div class="container">
        <div class="header-content">
          <h1 class="page-title">联系我</h1>
          <p class="page-subtitle">
            有任何问题或想法？我很乐意与你交流！
          </p>
          <div class="contact-stats">
            <div class="stat-item">
              <el-icon class="stat-icon"><Clock /></el-icon>
              <span class="stat-text">通常24小时内回复</span>
            </div>
            <div class="stat-item">
              <el-icon class="stat-icon"><Message /></el-icon>
              <span class="stat-text">欢迎技术交流</span>
            </div>
            <div class="stat-item">
              <el-icon class="stat-icon"><Star /></el-icon>
              <span class="stat-text">开放合作机会</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 联系方式 -->
    <section class="contact-methods-section">
      <div class="container">
        <h2 class="section-title">联系方式</h2>
        <div class="methods-grid">
          <div 
            v-for="method in contactMethods" 
            :key="method.type"
            class="method-card"
            @click="handleMethodClick(method)"
          >
            <div class="method-icon">
              <component :is="method.icon" />
            </div>
            <h3 class="method-title">{{ method.title }}

</h3>
            <p class="method-desc">{{ method.description }}

</p>
            <div class="method-value">
              <span class="value-text">{{ method.value }}

</span>
              <el-icon class="arrow-icon"><ArrowRight /></el-icon>
            </div>
            <div class="method-status">
              <span :class="['status-dot', method.status]"></span>
              <span class="status-text">{{ method.statusText }}

</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 联系表单 -->
    <section class="contact-form-section">
      <div class="container">
        <div class="form-content">
          <div class="form-header">
            <h2 class="section-title">发送消息</h2>
            <p class="form-desc">
              填写下面的表单，我会尽快回复你的消息。
              请详细描述你的问题或想法，这样我能更好地帮助你。
            </p>
          </div>
          
          <div class="form-container">
            <el-form 
              ref="contactFormRef"
              :model="contactForm" 
              :rules="formRules"
              label-position="top"
              class="contact-form"
            >
              <div class="form-row">
                <el-form-item label="姓名" prop="name" class="form-item">
                  <el-input 
                    v-model="contactForm.name" 
                    placeholder="请输入您的姓名"
                    size="large"
                  >
                    <template #prefix>
                      <el-icon><User /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                
                <el-form-item label="邮箱" prop="email" class="form-item">
                  <el-input 
                    v-model="contactForm.email" 
                    placeholder="请输入您的邮箱地址"
                    size="large"
                  >
                    <template #prefix>
                      <el-icon><Message /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>
              </div>
              
              <div class="form-row">
                <el-form-item label="主题" prop="subject" class="form-item full-width">
                  <el-input 
                    v-model="contactForm.subject" 
                    placeholder="请输入消息主题"
                    size="large"
                  >
                    <template #prefix>
                      <el-icon><Document /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>
              </div>
              
              <div class="form-row">
                <el-form-item label="消息类型" prop="type" class="form-item">
                  <el-select 
                    v-model="contactForm.type" 
                    placeholder="请选择消息类型"
                    size="large"
                    style="width: 100%"
                  >
                    <el-option 
                      v-for="type in messageTypes" 
                      :key="type.value"
                      :label="type.label" 
                      :value="type.value"
                    >
                      <div class="option-content">
                        <component :is="type.icon" class="option-icon" />
                        <span>{{ type.label }}

</span>
                      </div>
                    </el-option>
                  </el-select>
                </el-form-item>
                
                <el-form-item label="优先级" prop="priority" class="form-item">
                  <el-select 
                    v-model="contactForm.priority" 
                    placeholder="请选择优先级"
                    size="large"
                    style="width: 100%"
                  >
                    <el-option 
                      v-for="priority in priorityOptions" 
                      :key="priority.value"
                      :label="priority.label" 
                      :value="priority.value"
                    >
                      <div class="option-content">
                        <span :class="['priority-dot', priority.value]"></span>
                        <span>{{ priority.label }}

</span>
                      </div>
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              
              <el-form-item label="消息内容" prop="message" class="form-item full-width">
                <el-input 
                  v-model="contactForm.message" 
                  type="textarea" 
                  :rows="6"
                  placeholder="请详细描述您的问题、建议或想法..."
                  size="large"
                  show-word-limit
                  maxlength="1000"
                />
              </el-form-item>
              
              <el-form-item class="form-item full-width">
                <div class="form-actions">
                  <el-button 
                    type="primary" 
                    size="large"
                    @click="submitForm"
                    :loading="submitting"
                    class="submit-btn"
                  >
                    <el-icon v-if="!submitting"><Position /></el-icon>
                    {{ submitting ? '发送中...' : '发送消息' }}

                  </el-button>
                  
                  <el-button 
                    size="large"
                    @click="resetForm"
                    class="reset-btn"
                  >
                    <el-icon><Refresh /></el-icon>
                    重置表单
                  </el-button>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </section>
    
    <!-- FAQ 部分 -->
    <section class="faq-section">
      <div class="container">
        <h2 class="section-title">常见问题</h2>
        <div class="faq-content">
          <el-collapse v-model="activeFaq" accordion>
            <el-collapse-item 
              v-for="(faq, index) in faqList" 
              :key="index"
              :title="faq.question" 
              :name="index"
              class="faq-item"
            >
              <div class="faq-answer">
                <p v-for="(paragraph, pIndex) in faq.answer" :key="pIndex">
                  {{ paragraph }}
                </p>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </section>
    
    <!-- 其他联系方式 -->
    <section class="social-section">
      <div class="container">
        <h2 class="section-title">其他方式</h2>
        <p class="section-desc">
          你也可以通过以下社交平台找到我，关注我的最新动态和技术分享。
        </p>
        <div class="social-links">
          <a 
            v-for="social in socialLinks" 
            :key="social.name"
            :href="social.url" 
            target="_blank"
            class="social-link"
            :style="{ '--social-color': social.color }"
          >
            <div class="social-icon">
              <component :is="social.icon" />
            </div>
            <div class="social-content">
              <h3 class="social-name">{{ social.name }}

</h3>
              <p class="social-desc">{{ social.description }}

</p>
              <span class="social-handle">{{ social.handle }}

</span>
            </div>
            <el-icon class="social-arrow"><ArrowRight /></el-icon>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive }

 from 'vue'
import { ElMessage, ElMessageBox }

 from 'element-plus'
import type { FormInstance, FormRules }

 from 'element-plus'
import {
  Message, Clock, Star, ArrowRight, User, Document,
  Position, Refresh, Phone, Location, Link, ChatDotRound,
  QuestionFilled, TrendCharts, Tools, Promotion
} from '@element-plus/icons-vue'

// 表单引用
const contactFormRef = ref<FormInstance>()

// 联系方式
const contactMethods = ref([
  {
    type: 'email',
    title: '邮箱联系',
    description: '发送邮件给我，适合详细的技术讨论',
    value: 'zzb2004@example.com',
    icon: 'Message',
    status: 'online',
    statusText: '24小时内回复',
    action: 'mailto:zzb2004@example.com'
  },
  {
    type: 'github',
    title: 'GitHub',
    description: '查看我的项目，提交Issue或PR',
    value: 'github.com/zzb2004',
    icon: 'Link',
    status: 'active',
    statusText: '经常活跃',
    action: 'https://github.com/zzb2004'
  },
  {
    type: 'wechat',
    title: '微信',
    description: '即时沟通，快速响应',
    value: 'zzb2004_dev',
    icon: 'ChatDotRound',
    status: 'online',
    statusText: '工作时间在线',
    action: 'copy'
  },
  {
    type: 'phone',
    title: '电话',
    description: '紧急事务可直接电话联系',
    value: '+86 138-0000-0000',
    icon: 'Phone',
    status: 'busy',
    statusText: '请先发消息预约',
    action: 'tel:+8613800000000'
  }
])

// 消息类型
const messageTypes = ref([
  { label: '技术咨询', value: 'tech', icon: 'Tools' },
  { label: '项目合作', value: 'collaboration', icon: 'TrendCharts' },
  { label: '学习交流', value: 'learning', icon: 'QuestionFilled' },
  { label: '其他', value: 'other', icon: 'ChatDotRound' }
])

// 优先级选项
const priorityOptions = ref([
  { label: '低', value: 'low' },
  { label: '中', value: 'medium' },
  { label: '高', value: 'high' },
  { label: '紧急', value: 'urgent' }
])

// 联系表单
const contactForm = reactive({
  name: '',
  email: '',
  subject: '',
  type: '',
  priority: 'medium',
  message: ''
})

// 表单验证规则
const formRules: FormRules = {
  name: [
    {;
  email: [
    {;
  subject: [
    {
  message: [
    { required: true, min: 10, max: 1000, message: '消息内容应在10-1000个字符', trigger: 'blur' }
  ]
}

const submitting = ref(false)

// FAQ 数据
const activeFaq = ref(0)
const faqList = ref([
  {
    question: '如何快速联系到你？',
    answer: [
      '最快的方式是通过邮箱联系我，我通常会在24小时内回复。',
      '如果是紧急技术问题，可以在GitHub上提交Issue，我会优先处理。',
      '对于即时沟通，可以添加我的微信，工作时间内会及时回复。'
    ]
  },
  {
    question: '你接受什么类型的合作？',
    answer: [
      '我对前端开发项目、开源贡献、技术分享等合作机会都很感兴趣。',
      '特别欢迎Vue.js、React、TypeScript相关的项目合作。',
      '也乐意参与技术社区活动、写作分享等。'
    ]
  },
  {
    question: '可以请你帮忙解决技术问题吗？',
    answer: [
      '当然可以！我很乐意帮助解决前端开发相关的技术问题。',
      '请在联系时详细描述问题，包括错误信息、代码片段等。',
      '对于复杂问题，建议通过邮件或GitHub Issue的方式，这样可以更好地跟踪和讨论。'
    ]
  },
  {
    question: '你的回复时间是多久？',
    answer: [
      '邮件：通常24小时内回复，工作日会更快。',
      'GitHub：对于Issue和PR，我会在48小时内响应。',
      '微信：工作时间内基本可以即时回复。',
      '请理解，复杂的技术问题可能需要更多时间来准备详细的回复。'
    ]
  },
  {
    question: '可以约时间进行技术交流吗？',
    answer: [
      '当然欢迎！我很喜欢与其他开发者交流技术心得。',
      '可以通过邮件或微信预约时间，我们可以通过视频通话或面对面交流。',
      '建议提前说明想要讨论的技术话题，这样我可以做好准备。'
    ]
  }
])

// 社交链接
const socialLinks = ref([
  {
    name: 'GitHub',
    description: '查看我的开源项目和代码',
    handle: '@zzb2004',
    url: 'https://github.com/zzb2004',
    icon: 'Link',
    color: '#333'
  },
  {
    name: '技术博客',
    description: '阅读我的技术文章和学习笔记',
    handle: 'blog.zzb2004.com',
    url: 'https://blog.zzb2004.com',
    icon: 'Document',
    color: '#409eff'
  },
  {
    name: '掘金',
    description: '关注我在掘金的技术分享',
    handle: '@zzb2004',
    url: 'https://juejin.cn/user/zzb2004',
    icon: 'TrendCharts',
    color: '#1e80ff'
  },
  {
    name: 'CSDN',
    description: '查看我的技术博客文章',
    handle: 'zzb2004',
    url: 'https://blog.csdn.net/zzb2004',
    icon: 'Promotion',
    color: '#fc5531'
  }
])

// 处理联系方式点击
const handleMethodClick = (method: any) => {
  if (method.action === 'copy') {
    navigator.clipboard.writeText(method.value)
    ElMessage.success(`已复制 ${method.title} 到剪贴板`)
  } else if (method.action.startsWith('http') || method.action.startsWith('mailto') || method.action.startsWith('tel')) {
    window.open(method.action, '_blank')
  }
}

// 提交表单
const submitForm = async () => {
  if (!contactFormRef.value) return
  
  try {
    await contactFormRef.value.validate()
    
    submitting.value = true
    
    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    ElMessage.success('消息发送成功！我会尽快回复您。')
    
    // 重置表单
    resetForm()
  } catch (error) {
    ElMessage.error('请检查表单信息是否完整')
  }

 finally {
    submitting.value = false
  }
}

// 重置表单
const resetForm = () => {
  if (!contactFormRef.value) return
  
  ElMessageBox.confirm(
    '确定要重置表单吗？所有已填写的内容将被清空。',
    '确认重置',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    contactFormRef.value?.resetFields()
    ElMessage.success('表单已重置')
  }).catch(() => {
    // 用户取消
  })
}

</script>

<style lang="scss" scoped>
.contact-page {
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
    margin-bottom: 40px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .contact-stats {
    display: flex;
    justify-content: center;
    gap: 40px;
    
    @media (width <= 768px) {
      flex-direction: column;
      gap: 20px;
    }
    
    .stat-item {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .stat-icon {
        font-size: 20px;
      }
      
      .stat-text {
        font-size: 0.875rem;
        opacity: 0.9;
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

.section-desc {
  text-align: center;
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

// 联系方式
.contact-methods-section {
  .methods-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;
  }
  
  .method-card {
    background: var(--bg-color);
    padding: 30px;
    border-radius: 16px;
    border: 1px solid var(--border-color);
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow);
      border-color: var(--primary-color);
      
      .arrow-icon {
        transform: translateX(4px);
      }
    }
    
    .method-icon {
      width: 60px;
      height: 60px;
      background: linear-gradient(45deg, var(--primary-color), #667eea);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
      margin-bottom: 20px;
    }
    
    .method-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-color);
      margin-bottom: 8px;
    }
    
    .method-desc {
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 16px;
      font-size: 0.875rem;
    }
    
    .method-value {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      
      .value-text {
        font-weight: 500;
        color: var(--primary-color);
      }
      
      .arrow-icon {
        transition: transform 0.3s ease;
        color: var(--text-secondary);
      }
    }
    
    .method-status {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        
        &.online {
          background: #67c23a;
        }
        
        &.active {
          background: var(--primary-color);
        }
        
        &.busy {
          background: #f56c6c;
        }
      }
      
      .status-text {
        font-size: 0.75rem;
        color: var(--text-secondary);
      }
    }
  }
}

// 联系表单
.contact-form-section {
  .form-content {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .form-header {
    text-align: center;
    margin-bottom: 40px;
    
    .section-title {
      margin-bottom: 16px;
    }
    
    .form-desc {
      font-size: 1.125rem;
      color: var(--text-secondary);
      line-height: 1.6;
    }
  }
  
  .form-container {
    background: var(--bg-color);
    padding: 40px;
    border-radius: 16px;
    border: 1px solid var(--border-color);
    
    @media (width <= 768px) {
      padding: 30px 20px;
    }
  }
  
  .contact-form {
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      
      @media (width <= 768px) {
        grid-template-columns: 1fr;
      }
      
      .full-width {
        grid-column: 1 / -1;
      }
    }
    
    .form-item {
      margin-bottom: 24px;
      
      :deep(.el-form-item__label) {
        font-weight: 500;
        color: var(--text-color);
        margin-bottom: 8px;
      }
    }
    
    .option-content {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .option-icon {
        font-size: 16px;
        color: var(--primary-color);
      }
      
      .priority-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        
        &.low {
          background: #909399;
        }
        
        &.medium {
          background: var(--primary-color);
        }
        
        &.high {
          background: #e6a23c;
        }
        
        &.urgent {
          background: #f56c6c;
        }
      }
    }
    
    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      
      @media (width <= 768px) {
        flex-direction: column;
      }
      
      .submit-btn {
        min-width: 140px;
        
        @media (width <= 768px) {
          width: 100%;
        }
      }
      
      .reset-btn {
        @media (width <= 768px) {
          width: 100%;
        }
      }
    }
  }
}

// FAQ 部分
.faq-section {
  .faq-content {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .faq-item {
    margin-bottom: 16px;
    
    :deep(.el-collapse-item__header) {
      font-weight: 500;
      font-size: 1.125rem;
      color: var(--text-color);
      padding: 20px;
      background: var(--bg-color);
      border: 1px solid var(--border-color);
      border-radius: 8px;
    }
    
    :deep(.el-collapse-item__content) {
      padding: 20px;
      background: var(--bg-color);
      border: 1px solid var(--border-color);
      border-top: none;
      border-radius: 0 0 8px 8px;
    }
  }
  
  .faq-answer {
    p {
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 12px;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

// 社交链接
.social-section {
  .social-links {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .social-link {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 24px;
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    text-decoration: none;
    color: var(--text-color);
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow);
      border-color: var(--social-color);
      
      .social-icon {
        background: var(--social-color);
        color: white;
      }
      
      .social-arrow {
        transform: translateX(4px);
      }
    }
    
    .social-icon {
      width: 48px;
      height: 48px;
      background: var(--bg-secondary);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: var(--social-color);
      transition: all 0.3s ease;
    }
    
    .social-content {
      flex: 1;
      
      .social-name {
        font-size: 1.125rem;
        font-weight: 600;
        margin-bottom: 4px;
      }
      
      .social-desc {
        font-size: 0.875rem;
        color: var(--text-secondary);
        margin-bottom: 4px;
      }
      
      .social-handle {
        font-size: 0.75rem;
        color: var(--social-color);
        font-weight: 500;
      }
    }
    
    .social-arrow {
      color: var(--text-secondary);
      transition: transform 0.3s ease;
    }
  }
}
</style>