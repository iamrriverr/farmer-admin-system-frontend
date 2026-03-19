/**
 * 認證相關型別定義
 */

import type { UserInfo } from './user';

/**
 * 登入請求參數
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * 登入回應
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: UserInfo;
  mustChangePassword: boolean; // 是否需要強制修改密碼（首次登入或管理員重置後）
}

/**
 * Token 資訊
 */
export interface TokenInfo {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

/**
 * 修改密碼請求
 */
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

/**
 * 修改密碼回應
 */
export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}
