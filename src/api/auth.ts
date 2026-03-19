/**
 * 認證相關 API
 * 目前使用 Mock 登入（在 stores/auth.ts 中實作）
 * 待後端 API 完成後，再實作真實的 API 呼叫
 */

import type { LoginRequest, LoginResponse } from '@/types/auth';

/**
 * 登入
 * TODO: 待後端 API 完成後實作
 */
export const login = (_data: LoginRequest): Promise<LoginResponse> => {
  throw new Error('API not implemented - using mock login in store');
};

/**
 * 登出
 * TODO: 待後端 API 完成後實作
 */
export const logout = (): Promise<void> => {
  throw new Error('API not implemented');
};

/**
 * 刷新 Token
 * TODO: 待後端 API 完成後實作
 */
export const refreshToken = (): Promise<{ accessToken: string }> => {
  throw new Error('API not implemented');
};
