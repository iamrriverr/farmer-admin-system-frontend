/**
 * Department API（部門管理）
 *
 * TODO: 後端整合後替換各函式實作
 * 目前皆為 stub，實際資料由 stores/department.ts 提供
 */

import type {
  ApiResponse,
  Department,
  DepartmentFormData,
  PaginationParams,
  PaginationResponse,
} from '@/types';
import { httpClient } from '@/utils/request';

// ---------------------------------------------------------------------------
// 查詢
// ---------------------------------------------------------------------------

/**
 * 取得部門列表（支援分頁）
 */
export const getDepartments = async (
  params?: PaginationParams & { active?: boolean }
): Promise<ApiResponse<PaginationResponse<Department>>> =>
  httpClient.get<PaginationResponse<Department>>('/departments', { params });

/**
 * 取得單一部門
 */
export const getDepartment = async (id: string): Promise<ApiResponse<Department>> =>
  httpClient.get<Department>(`/departments/${id}`);

/**
 * 取得所有啟用中的部門（供下拉選單使用，不分頁）
 */
export const getActiveDepartments = async (): Promise<ApiResponse<Department[]>> =>
  httpClient.get<Department[]>('/departments', { params: { active: true, pageSize: 999 } });

// ---------------------------------------------------------------------------
// 新增 / 更新 / 刪除
// ---------------------------------------------------------------------------

/**
 * 新增部門
 */
export const createDepartment = async (
  data: DepartmentFormData
): Promise<ApiResponse<Department>> =>
  httpClient.post<Department>('/departments', data);

/**
 * 更新部門
 */
export const updateDepartment = async (
  id: string,
  data: Partial<DepartmentFormData>
): Promise<ApiResponse<Department>> =>
  httpClient.put<Department>(`/departments/${id}`, data);

/**
 * 刪除部門
 */
export const deleteDepartment = async (id: string): Promise<ApiResponse<void>> =>
  httpClient.delete<void>(`/departments/${id}`);
