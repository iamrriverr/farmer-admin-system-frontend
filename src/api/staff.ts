/**
 * Staff API（人員管理）
 *
 * TODO: 後端整合後替換各函式實作
 * 目前皆為 stub，實際資料由 stores/staff.ts 提供
 */

import type {
  ApiResponse,
  PaginationParams,
  PaginationResponse,
  UserInfo,
  UserRole,
} from '@/types';
import { httpClient } from '@/utils/request';

// ---------------------------------------------------------------------------
// 查詢
// ---------------------------------------------------------------------------

/**
 * 取得人員列表（支援分頁與篩選）
 */
export const getStaff = async (
  params?: PaginationParams & {
    department?: string;
    role?: UserRole;
    active?: boolean;
    keyword?: string;
  }
): Promise<ApiResponse<PaginationResponse<UserInfo>>> =>
  httpClient.get<PaginationResponse<UserInfo>>('/staff', { params });

/**
 * 取得單一人員
 */
export const getStaffById = async (id: string): Promise<ApiResponse<UserInfo>> =>
  httpClient.get<UserInfo>(`/staff/${id}`);

/**
 * 取得所有可作為部門主管的人員（供下拉選單使用）
 */
export const getManagers = async (): Promise<ApiResponse<UserInfo[]>> =>
  httpClient.get<UserInfo[]>('/staff/managers');

// ---------------------------------------------------------------------------
// 新增 / 更新 / 刪除
// ---------------------------------------------------------------------------

/**
 * 新增人員
 */
export const createStaff = async (data: {
  username: string;
  name?: string;
  role: UserRole;
  department?: string;
  password: string;
  mustChangePassword?: boolean;
}): Promise<ApiResponse<UserInfo>> =>
  httpClient.post<UserInfo>('/staff', data);

/**
 * 更新人員基本資料
 */
export const updateStaff = async (
  id: string,
  data: Partial<Pick<UserInfo, 'name' | 'department'>>
): Promise<ApiResponse<UserInfo>> =>
  httpClient.put<UserInfo>(`/staff/${id}`, data);

/**
 * 更新人員權限（角色）
 */
export const updateStaffRole = async (
  id: string,
  role: UserRole
): Promise<ApiResponse<UserInfo>> =>
  httpClient.patch<UserInfo>(`/staff/${id}/role`, { role });

/**
 * 重置密碼
 */
export const resetPassword = async (
  id: string,
  payload: { newPassword: string; mustChangePassword: boolean }
): Promise<ApiResponse<void>> =>
  httpClient.post<void>(`/staff/${id}/reset-password`, payload);

/**
 * 刪除人員
 */
export const deleteStaff = async (id: string): Promise<ApiResponse<void>> =>
  httpClient.delete<void>(`/staff/${id}`);
