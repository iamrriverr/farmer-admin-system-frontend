/**
 * 部門相關型別定義
 */

/**
 * 部門資訊
 */
export interface Department {
  id: string; // 部門 ID
  code: string; // 部門代碼
  name: string; // 部門名稱
  managerName?: string; // 部門主管姓名
  memberCount: number; // 員工人數
  knowledgeBaseCount?: number; // 知識庫文件數量
  active: boolean; // 是否啟用
  createdAt: string; // 建立時間
  updatedAt?: string; // 更新時間
}

/**
 * 新增/編輯部門請求
 */
export interface DepartmentFormData {
  code: string;
  name: string;
  managerName?: string;
  active: boolean;
}
