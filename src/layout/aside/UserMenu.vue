<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useTheme } from '@/composables/useTheme';
import { ICONS } from '@/constants';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { ROLE_LABELS } from '@/types/user';

/**
 * 使用者選單彈窗組件
 * 整合使用者資訊、主題切換與帳號操作
 */

const emit = defineEmits<{
  close: [];
}>();

const router = useRouter();
const { theme, setTheme } = useTheme();
const authStore = useAuthStore();
const userStore = useUserStore();
const menuRef = ref<HTMLDivElement | null>(null);

// 從 store 讀取使用者資料
const userInfo = computed(() => userStore.user);

const themeOptions = [
  { value: 'light' as const, label: '淺色', icon: 'SUN' as const },
  { value: 'dark' as const, label: '深色', icon: 'MOON' as const },
  { value: 'system' as const, label: '系統', icon: 'COMPUTER' as const },
];

const handleThemeSelect = (value: any) => {
  setTheme(value);
};

const handleLogout = () => {
  // 清除認證資訊
  authStore.logout();
  userStore.clearUser();

  // 關閉選單
  emit('close');

  // 重定向到登入頁
  router.push('/login');
};

/**
 * 變更密碼
 * 跳轉到修改密碼頁面
 */
const handleChangePassword = () => {
  emit('close');
  router.push('/change-password');
};

// 點擊外部關閉
const handleClickOutside = (event: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    emit('close');
  }
};

onMounted(() => {
  setTimeout(() => {
    window.addEventListener('click', handleClickOutside);
  }, 0);
});

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div ref="menuRef" class="user-menu-popover">
    <!-- 使用者資訊區域 -->
    <div v-if="userInfo" class="user-info-section">
      <div class="user-avatar-large">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="ICONS.USER" />
        </svg>
      </div>
      <div class="user-details">
        <div class="user-id">{{ userInfo.name }}</div>
        <div class="user-meta">
          <span class="role-tag">{{ ROLE_LABELS[userInfo.role] }}</span>
          <span class="dept-text">{{ userInfo.department }}</span>
        </div>
      </div>
    </div>

    <div class="divider"></div>

    <!-- 主題切換區域 -->
    <div class="section-container">
      <div class="section-label">外觀界面</div>
      <div class="theme-grid">
        <button
          v-for="option in themeOptions"
          :key="option.value"
          class="theme-btn"
          :class="{ active: theme === option.value }"
          @click="handleThemeSelect(option.value)"
          :title="option.label"
        >
          <svg class="theme-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="ICONS[option.icon]"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="divider"></div>

    <!-- 功能操作區域 -->
    <div class="actions-section">
      <button class="action-item" @click="handleChangePassword">
        <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="ICONS.EDIT" />
        </svg>
        <span>變更密碼</span>
      </button>

      <button class="action-item logout" @click="handleLogout">
        <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="ICONS.LOGOUT" />
        </svg>
        <span>退出登錄</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.user-menu-popover {
  position: absolute;
  bottom: 1.5rem;
  left: calc(100% + 0.75rem);
  z-index: 100;
  width: 16rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: 1rem;
  box-shadow:
    0 10px 25px -5px rgb(0 0 0 / 15%),
    0 8px 10px -6px rgb(0 0 0 / 10%);
  animation: slideIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 使用者資訊 */
.user-info-section {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 1.25rem;
}

.user-avatar-large {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  color: white;
  background: linear-gradient(135deg, var(--primary), #4285f4);
  border-radius: 50%;
}

.user-avatar-large svg {
  width: 1.5rem;
  height: 1.5rem;
}

.user-details {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.user-id {
  font-family: 'Segoe UI';
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary);
}

.user-meta {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.role-tag {
  padding: 0.125rem 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--primary);
  background: var(--primary-light);
  border-radius: 4px;
}

.dept-text {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* 區隔線 */
.divider {
  height: 1px;
  background-color: var(--border-primary);
}

/* 區塊標籤 */
.section-label {
  margin-bottom: 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.section-container {
  padding: 1.25rem;
}

/* 主題切換 */
.theme-grid {
  display: flex;
  gap: 0.5rem;
  padding: 0.25rem;
  background: var(--bg-secondary);
  border-radius: 0.75rem;
}

.theme-btn {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 2.25rem;
  color: var(--text-secondary);
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 0.5rem;
}

.theme-btn:hover {
  color: var(--text-primary);
  transition: color 0.2s ease;
}

.theme-btn.active {
  color: var(--primary);
  background: var(--bg-primary);
  box-shadow: 0 2px 4px rgb(0 0 0 / 5%);
}

.theme-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* 功能操作 */
.actions-section {
  padding: 0.5rem;
}

.action-item {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  width: 100%;
  padding: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 0.5rem;
}

.action-item:hover {
  background: var(--bg-secondary);
  transition: background-color 0.2s ease;
}

.action-item.logout {
  color: var(--error);
}

.action-item.logout:hover {
  background: color-mix(in srgb, var(--error) 10%, transparent);
}

.action-icon {
  width: 1.1rem;
  height: 1.1rem;
}
</style>
