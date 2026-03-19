import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type { UserInfo } from '@/types/user';
import { ROLE_LABELS } from '@/types/user';

/**
 * 用戶資訊狀態管理
 * 專注於管理用戶個人資料
 */
export const useUserStore = defineStore(
  'user',
  () => {
    // State
    const user = ref<UserInfo | null>(null);

    // Getters
    const isAdmin = computed(() => user.value?.role === 'admin');
    const isManager = computed(() => user.value?.role === 'manager');
    const userName = computed(() => user.value?.name || '');
    const userRole = computed(() => {
      return user.value?.role ? ROLE_LABELS[user.value.role] : '';
    });
    const userDepartment = computed(() => user.value?.department || '');

    // Actions
    /**
     * 設定用戶資訊
     */
    const setUser = (userInfo: UserInfo): void => {
      user.value = userInfo;
    };

    /**
     * 清除用戶資訊
     */
    const clearUser = (): void => {
      user.value = null;
    };

    return {
      // State
      user,
      // Getters
      isAdmin,
      isManager,
      userName,
      userRole,
      userDepartment,
      // Actions
      setUser,
      clearUser,
    };
  },
  {
    persist: {
      key: 'user-info',
      pick: ['user'],
    },
  }
);
