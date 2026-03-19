/**
 * 使用者相關型別定義
 */

export type UserRole = 'admin' | 'manager' | 'user';

/**
 * 使用者資訊介面
 */
export interface UserInfo {
  id: string;
  username: string; // 用戶名（用於登入）
  name?: string; // 真實姓名(可選)
  role: UserRole;
  department: string; // 主要部門（目前使用）
  mustChangePassword?: boolean; // 是否需要修改密碼（首次登入或密碼被重置）
  email?: string; // Email(預留擴展，未來可啟用)
  phone?: string; // 電話(可選)
  active?: boolean; // 帳號是否啟用
  createdAt?: string; // 建立時間
  updatedAt?: string; // 更新時間
  lastLoginAt?: string; // 最後登入時間
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: '系統管理員',
  manager: '部門主管',
  user: '一般員工',
};
