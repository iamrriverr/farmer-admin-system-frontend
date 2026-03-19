// 模組類型
// 側邊欄模組類型
export type ModuleType =
  | 'new-chat'
  | 'conversation'
  | 'knowledge-base'
  | 'eform'
  | 'departments'
  | 'staff'
  | 'logs';

// 側邊欄狀態
export interface SidebarState {
  activeModule: ModuleType;
  isSecondaryExpanded: boolean;
}

// 選單項目
export interface MenuItem {
  id: ModuleType;
  icon: string;
  label: string;
  route: string;
}
