import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type {
  ChangePasswordResponse,
  LoginRequest,
  LoginResponse,
} from '@/types/auth';

import { mockLoginData, mockPasswords } from '@/mock/auth';

import { useUserStore } from './user';

/**
 * 認證狀態管理
 * 專注於管理 Token 和登入狀態
 */
export const useAuthStore = defineStore(
  'auth',
  () => {
    // State
    const accessToken = ref<string | null>(null);
    const isLoggingIn = ref(false);

    // Getters
    const isAuthenticated = computed(() => !!accessToken.value);

    // Actions
    /**
     * 設定 Token
     */
    const setToken = (token: string): void => {
      accessToken.value = token;
    };

    /**
     * 清除 Token
     */
    const clearToken = (): void => {
      accessToken.value = null;
    };

    /**
     * 登入
     */
    const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
      isLoggingIn.value = true;

      try {
        // Mock 登入邏輯判斷
        if (import.meta.env.VITE_USE_MOCK === 'true') {
          await new Promise((resolve) => setTimeout(resolve, 800));
          const mockResponse = await mockLoginData(credentials);
          setToken(mockResponse.accessToken);
          return mockResponse;
        }

        // TODO: 替換為真實 API 呼叫
        // const response = await authApi.login(credentials);
        // setToken(response.accessToken);
        // return response;
        throw new Error('未啟用 Mock，且後端 API 未連接。');
      } finally {
        isLoggingIn.value = false;
      }
    };

    /**
     * 登出
     */
    const logout = (): void => {
      clearToken();
    };

    /**
     * 修改密碼
     * Mock 實作：驗證舊密碼，更新使用者狀態
     */
    const changePassword = async (
      oldPassword: string,
      newPassword: string
    ): Promise<ChangePasswordResponse> => {
      isLoggingIn.value = true;

      try {
        // Mock 判斷
        if (import.meta.env.VITE_USE_MOCK === 'true') {
          await new Promise((resolve) => setTimeout(resolve, 800));
          const userStore = useUserStore();
          const currentUser = userStore.user;
          if (!currentUser) throw new Error('未登入');

          const correctPassword = mockPasswords[currentUser.username];
          if (oldPassword !== correctPassword) throw new Error('舊密碼錯誤');
          if (oldPassword === newPassword) throw new Error('新密碼不能與舊密碼相同');

          userStore.setUser({ ...currentUser, mustChangePassword: false });
          return { success: true, message: '密碼修改成功' };
        }

        // TODO: 替換為真實 API 呼叫
        // const response = await authApi.changePassword({ oldPassword, newPassword });
        // return response;
        throw new Error('未啟用 Mock，且後端 API 未連接。');
      } finally {
        isLoggingIn.value = false;
      }
    };

    return {
      // State
      accessToken,
      isLoggingIn,
      // Getters
      isAuthenticated,
      // Actions
      setToken,
      clearToken,
      login,
      logout,
      changePassword,
    };
  },
  {
    persist: {
      key: 'auth-token',
      pick: ['accessToken'],
    },
  }
);


