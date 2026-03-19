/**
 * 應用程式配置
 */

// 應用名稱
export const APP_NAME = 'Farmer Admin System';

// 應用版本
export const APP_VERSION = '1.0.0';

// 分頁配置
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// 檔案上傳配置
export const UPLOAD = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],
  ALLOWED_FILE_EXTENSIONS: ['.pdf', '.doc', '.docx', '.txt'],
};

// 對話配置
export const CHAT = {
  MAX_CONVERSATION_TITLE_LENGTH: 30,
  MAX_MESSAGE_LENGTH: 5000,
};

// 本地儲存 Key
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_info',
  THEME: 'app_theme',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
};
