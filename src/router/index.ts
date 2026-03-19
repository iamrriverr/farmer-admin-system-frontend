import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

import AuthLayout from '@/layout/AuthLayout.vue';
import AppLayout from '@/layout/index.vue';

import { setupAuthGuard } from './guard';

const routes: RouteRecordRaw[] = [
  // 登入路由（使用 AuthLayout）
  {
    path: '/login',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('@/views/auth/index.vue'),
        meta: {
          title: '登入',
        },
      },
    ],
  },
  // 修改密碼路由（使用 AuthLayout）
  {
    path: '/change-password',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'change-password',
        component: () => import('@/views/auth/ChangePassword.vue'),
        meta: {
          title: '修改密碼',
          requiresAuth: true,
        },
      },
    ],
  },
  // 忘記密碼路由（使用 AuthLayout）
  {
    path: '/forgot-password',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'forgot-password',
        component: () => import('@/views/auth/ForgotPassword.vue'),
        meta: {
          title: '忘記密碼',
        },
      },
    ],
  },
  // 主應用路由（使用 AppLayout）
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '',
        redirect: '/chat',
      },
      {
        path: 'chat/:id?',
        name: 'chat',
        component: () => import('@/views/chat/index.vue'),
        meta: {
          title: 'AI 聊天',
          requiresAuth: true,
        },
      },
      {
        path: 'knowledge-base',
        name: 'knowledge-base',
        component: () => import('@/views/knowledge-base/index.vue'),
        meta: {
          title: '知識庫',
          requiresAuth: true,
        },
      },
      {
        path: 'eform',
        name: 'eform',
        component: () => import('@/views/e-form/index.vue'),
        meta: {
          title: '電子表單',
          requiresAuth: true,
        },
      },
      {
        path: 'departments',
        name: 'departments',
        component: () => import('@/views/departments/index.vue'),
        meta: {
          title: '部門管理',
          requiresAuth: true,
        },
      },
      {
        path: 'staff',
        name: 'staff',
        component: () => import('@/views/staff/index.vue'),
        meta: {
          title: '人員管理',
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// 全局導航守衛
router.beforeEach((to, from, next) => {
  // 設定頁面標題
  if (to.meta.title) {
    document.title = `${to.meta.title} - Farmer Admin System`;
  }

  // 認證守衛
  setupAuthGuard(to, from, next);
});

export default router;
