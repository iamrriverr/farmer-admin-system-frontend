/**
 * API 配置
 */

// API 基礎 URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// API 超時時間 (毫秒)
export const API_TIMEOUT = 10000;

// API 版本
export const API_VERSION = 'v1';

// 完整 API URL
export const getApiUrl = (path: string): string => {
  return `${API_BASE_URL}/${API_VERSION}${path}`;
};
