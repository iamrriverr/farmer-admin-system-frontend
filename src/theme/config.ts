import type { ThemeMode, ThemeOption } from '@/types/theme';

/** 系統名稱與前綴 **/
export const APP_NAME = 'Farmer Admin';
export const APP_PREFIX = 'fa';

/** 主題模式 常數 **/
export const FA_THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

/** 預設主題 **/
export const FA_DEFAULT_THEME: ThemeMode = 'system';

/** LocalStorage Key **/
export const FA_THEME_STORAGE_KEY = `${APP_PREFIX}-theme`;

/** 主題切換選項 **/
export const FA_THEME_OPTIONS: ThemeOption[] = [
  {
    value: 'light',
    label: '淺色模式',
    icon: 'sun',
    description: '使用淺色主題',
  },
  {
    value: 'dark',
    label: '深色模式',
    icon: 'moon',
    description: '使用深色主題',
  },
  {
    value: 'system',
    label: '跟隨系統',
    icon: 'computer',
    description: '依系統自動切換',
  },
];

/** Icon對應 */
export const FA_THEME_ICONS: Record<ThemeMode, 'sun' | 'moon' | 'computer'> = {
  light: 'sun',
  dark: 'moon',
  system: 'computer',
};

/** 標籤對應 */
export const FA_THEME_LABELS: Record<ThemeMode, string> = {
  light: '淺色模式',
  dark: '深色模式',
  system: '跟隨系統',
};

/** 深色監聽與class名稱 */
export const FA_MEDIA_QUERY_DARK = '(prefers-color-scheme: dark)';
export const FA_DARK_CLASS = 'dark';

/** 動畫時長 */
export const FA_TRANSITION_DURATION = 300;
