import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置NProgress
NProgress.configure({ showSpinner: false })

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '首页 - ZZB2004'
    }
  },
  {
    path: '/tutorials',
    name: 'Tutorials',
    component: () => import('@/views/Tutorials.vue'),
    meta: {
      title: '前端教程 - ZZB2004'
    }
  },
  {
    path: '/tutorials/:category',
    name: 'TutorialCategory',
    component: () => import('@/views/TutorialCategory.vue'),
    meta: {
      title: '教程分类 - ZZB2004'
    }
  },
  {
    path: '/tutorials/:category/:id',
    name: 'TutorialDetail',
    component: () => import('@/views/TutorialDetail.vue'),
    meta: {
      title: '教程详情 - ZZB2004'
    }
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('@/views/Projects.vue'),
    meta: {
      title: '项目展示 - ZZB2004'
    }
  },
  {
    path: '/projects/:id',
    name: 'ProjectDetail',
    component: () => import('@/views/ProjectDetail.vue'),
    meta: {
      title: '项目详情 - ZZB2004'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
    meta: {
      title: '关于我 - ZZB2004'
    }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/views/Contact.vue'),
    meta: {
      title: '联系我 - ZZB2004'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/404.vue'),
    meta: {
      title: '页面未找到 - ZZB2004'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  NProgress.start()
  
  // 设置页面标题
  if (to.meta?.title) {
    document.title = to.meta.title as string
  }
  
  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router