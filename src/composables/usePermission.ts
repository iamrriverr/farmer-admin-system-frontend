/**
 * 權限檢查 Composable
 * 提供權限檢查相關的工具函數
 */

import { computed } from 'vue';

import { FEATURE_PERMISSIONS, ROUTE_PERMISSIONS } from '@/config/permissions';
import { useUserStore } from '@/stores/user';

export function usePermission() {
  const userStore = useUserStore();

  /**
   * 當前使用者角色
   */
  const userRole = computed(() => userStore.user?.role);

  /**
   * 檢查是否有路由訪問權限
   * @param path 路由路徑
   * @returns 是否有權限
   */
  const hasRoutePermission = (path: string): boolean => {
    if (!userRole.value) return false;
    const allowedRoutes = ROUTE_PERMISSIONS[userRole.value] || [];
    return allowedRoutes.some((route) => path.startsWith(route));
  };

  /**
   * 檢查是否有功能權限
   * @param feature 功能名稱
   * @param action 操作類型
   * @returns 是否有權限
   */
  const hasFeaturePermission = (
    feature: string,
    action: 'view' | 'create' | 'edit' | 'delete' | 'manage'
  ): boolean => {
    if (!userRole.value) return false;
    const permission = FEATURE_PERMISSIONS[feature]?.[userRole.value];
    if (!permission) return false;

    const actionMap = {
      view: 'canView',
      create: 'canCreate',
      edit: 'canEdit',
      delete: 'canDelete',
      manage: 'canManage',
    } as const;

    return permission[actionMap[action]] as boolean;
  };

  /**
   * 獲取功能的資料範圍
   * @param feature 功能名稱
   * @returns 資料範圍
   */
  const getFeatureScope = (feature: string): 'all' | 'department' | 'self' | null => {
    if (!userRole.value) return null;
    return FEATURE_PERMISSIONS[feature]?.[userRole.value]?.scope || null;
  };

  /**
   * 檢查是否為管理員
   */
  const isAdmin = computed(() => userRole.value === 'admin');

  /**
   * 檢查是否為部門主管
   */
  const isManager = computed(() => userRole.value === 'manager');

  /**
   * 檢查是否為一般員工
   */
  const isUser = computed(() => userRole.value === 'user');

  return {
    userRole,
    hasRoutePermission,
    hasFeaturePermission,
    getFeatureScope,
    isAdmin,
    isManager,
    isUser,
  };
}
