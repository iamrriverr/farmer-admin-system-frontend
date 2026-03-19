/** 使用者選擇的主題模式 */
export type ThemeMode = 'light' | 'dark' | 'system';

/** 實際應用的主題 */
export type AppliedTheme = 'light' | 'dark';

/** 主題選項定義 */
export interface ThemeOption {
  value: ThemeMode;
  label: string;
  icon: 'sun' | 'moon' | 'computer';
  description: string;
}

/** 主題狀態定義 */
export interface ThemeState {
  currentTheme: ThemeMode;
  appliedTheme: AppliedTheme;
}
