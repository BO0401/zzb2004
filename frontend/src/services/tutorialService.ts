// 教程服务 - 用于加载和管理教程内容

// 从 utils 导入工具函数
import { formatNumber, formatDate, getDifficultyText, getStatusText } from '@/utils'

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: 'html' | 'css' | 'javascript' | 'vue';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  readTime: number;
  views: number;
  content?: string;
  cover: string;
  status: 'published' | 'draft';
}

export interface TutorialCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
  tutorials: Tutorial[];
}

// HTML 教程数据
const htmlTutorials: Tutorial[] = [
  {
    id: 'html-welcome',
    title: 'HTML5 基础入门',
    description: '从零开始学习HTML5，掌握网页结构的基本知识和语义化标签的使用',
    category: 'html',
    difficulty: 'beginner',
    tags: ['HTML5', '语义化', '基础'],
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-01-20'),
    readTime: 15,
    views: 1520,
    cover: '/logo.svg',
    status: 'published'
  },
  {
    id: 'html-doctype',
    title: 'DOCTYPE 声明与文档类型',
    description: '理解DOCTYPE声明的作用，掌握HTML文档类型的使用方法',
    category: 'html',
    difficulty: 'beginner',
    tags: ['DOCTYPE', '文档类型', 'HTML5'],
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-01-20'),
    readTime: 8,
    views: 880,
    cover: '/logo.svg',
    status: 'published'
  },
  {
    id: 'html-head',
    title: 'HTML Head 区域详解',
    description: '深入了解HTML head标签及其内部元素的使用方法',
    category: 'html',
    difficulty: 'intermediate',
    tags: ['head', 'meta', 'title'],
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-01-20'),
    readTime: 12,
    views: 1200,
    cover: '/logo.svg',
    status: 'published'
  },
  {
    id: 'html-table',
    title: 'HTML 表格与表单',
    description: '学习HTML表格和表单的创建，掌握数据展示和收集的方法',
    category: 'html',
    difficulty: 'intermediate',
    tags: ['表格', '表单', '数据'],
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-01-20'),
    readTime: 20,
    views: 980,
    cover: '/logo.svg',
    status: 'published'
  }
]

// CSS 教程数据
const cssTutorials: Tutorial[] = [
  {
    id: 'css-basics',
    title: 'CSS 基础语法',
    description: '学习CSS的基本语法、选择器和常用样式属性，为网页添加样式',
    category: 'css',
    difficulty: 'beginner',
    tags: ['CSS基础', '选择器', '语法'],
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-01-20'),
    readTime: 18,
    views: 2340,
    cover: '/logo.svg',
    status: 'published'
  },
  {
    id: 'css-selectors',
    title: 'CSS 选择器详解',
    description: '掌握各种CSS选择器的使用方法，提高样式编写效率',
    category: 'css',
    difficulty: 'intermediate',
    tags: ['选择器', '伪类', '伪元素'],
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-01-20'),
    readTime: 25,
    views: 1850,
    cover: '/logo.svg',
    status: 'published'
  },
  {
    id: 'css-flexbox',
    title: 'Flexbox 弹性布局',
    description: '掌握Flexbox布局，轻松实现各种复杂的页面布局效果',
    category: 'css',
    difficulty: 'intermediate',
    tags: ['Flexbox', '布局', '响应式'],
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-01-20'),
    readTime: 30,
    views: 1890,
    cover: '/logo.svg',
    status: 'published'
  },
  {
    id: 'css-grid',
    title: 'CSS Grid 网格布局',
    description: '学习CSS Grid网格布局系统，构建复杂的二维布局结构',
    category: 'css',
    difficulty: 'advanced',
    tags: ['Grid', '网格', '二维布局'],
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-01-20'),
    readTime: 35,
    views: 1456,
    cover: '/logo.svg',
    status: 'published'
  },
  {
    id: 'css-variables',
    title: 'CSS 变量与主题切换',
    description: 'CSS 自定义属性（变量）的使用，实现主题切换和动态样式',
    category: 'css',
    difficulty: 'intermediate',
    tags: ['CSS变量', '主题', '自定义属性'],
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-01-20'),
    readTime: 22,
    views: 1320,
    cover: '/logo.svg',
    status: 'published'
  },
  {
    id: 'css-functions',
    title: 'CSS 函数详解',
    description: '深入学习 calc、min、max、clamp 等 CSS 函数的使用',
    category: 'css',
    difficulty: 'intermediate',
    tags: ['CSS函数', 'calc', 'clamp'],
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-01-20'),
    readTime: 28,
    views: 1150,
    cover: '/logo.svg',
    status: 'published'
  }
]

// 分类数据
const categories: TutorialCategory[] = [
  {
    id: 'html',
    name: 'HTML',
    description: 'HTML 基础知识，从入门到精通',
    icon: 'Monitor',
    count: htmlTutorials.length,
    tutorials: htmlTutorials
  },
  {
    id: 'css',
    name: 'CSS',
    description: 'CSS 样式设计，打造美观的网页',
    icon: 'Code',
    count: cssTutorials.length,
    tutorials: cssTutorials
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    description: 'JavaScript 编程，为网页添加交互',
    icon: 'Cpu',
    count: 0,
    tutorials: []
  },
  {
    id: 'vue',
    name: 'Vue',
    description: 'Vue.js 框架，构建现代前端应用',
    icon: 'Trophy',
    count: 0,
    tutorials: []
  }
]

// 所有教程
const allTutorials = [...htmlTutorials, ...cssTutorials]

// 获取教程内容
export async function getTutorialContent(category: string, id: string): Promise<string> {
  // 模拟教程内容
  return `
    <h2>教程内容</h2>
    <p>这是 ${category} 分类下 ${id} 教程的内容。</p>
    <p>教程内容正在开发中，敬请期待。</p>
  `
}

// 获取所有教程
export function getAllTutorials(): Tutorial[] {
  return [...allTutorials]
}

// 根据分类获取教程
export function getTutorialsByCategory(category: string): Tutorial[] {
  if (category === 'all') {
    return allTutorials
  }
  return allTutorials.filter(tutorial => tutorial.category === category)
}

// 根据ID获取教程
export function getTutorialById(id: string): Tutorial | undefined {
  return allTutorials.find(tutorial => tutorial.id === id)
}

// 获取相关教程
export function getRelatedTutorials(currentTutorial: Tutorial, limit: number = 4): Tutorial[] {
  return allTutorials
    .filter(tutorial => 
      tutorial.id !== currentTutorial.id && 
      (tutorial.category === currentTutorial.category || 
       tutorial.tags.some(tag => currentTutorial.tags.includes(tag)))
    )
    .slice(0, limit)
}

// 搜索教程
export function searchTutorials(keyword: string): Tutorial[] {
  const lowerKeyword = keyword.toLowerCase()
  return allTutorials.filter(tutorial =>
    tutorial.title.toLowerCase().includes(lowerKeyword) ||
    tutorial.description.toLowerCase().includes(lowerKeyword) ||
    tutorial.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
  )
}

// 获取分类信息
export function getCategories(): TutorialCategory[] {
  return categories
}

// 获取分类信息（包含教程数量）
export function getCategoryWithCount(categoryId: string): TutorialCategory | undefined {
  const category = categories.find(cat => cat.id === categoryId)
  if (category) {
    category.count = getTutorialsByCategory(categoryId).length
  }
  return category
}

// 重新导出，保持向后兼容
export { formatNumber, formatDate, getDifficultyText, getStatusText }