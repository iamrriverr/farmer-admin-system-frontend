/**
 * HTTP 請求客戶端
 * 統一封裝 axios，提供請求/回應攔截器
 */

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

import { API_BASE_URL, API_TIMEOUT } from '@/config';
import type { ApiResponse } from '@/types';

class HttpClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * 設置請求/回應攔截器
   */
  private setupInterceptors(): void {
    // 請求攔截器
    this.instance.interceptors.request.use(
      (config) => {
        // 添加 token
        const token = localStorage.getItem('auth_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 回應攔截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        const { data } = response;

        // 檢查業務狀態碼
        if (data.code !== 0) {
          return Promise.reject(new Error(data.message || '請求失敗'));
        }

        return response;
      },
      (error) => {
        // 處理 HTTP 錯誤
        if (error.response) {
          const { status } = error.response;

          switch (status) {
            case 401:
              // 未授權，清除 token 並跳轉登入頁
              localStorage.removeItem('auth_token');
              // TODO: 跳轉登入頁
              break;
            case 403:
              console.error('無權限訪問');
              break;
            case 404:
              console.error('請求的資源不存在');
              break;
            case 500:
              console.error('伺服器錯誤');
              break;
            default:
              console.error(`請求失敗: ${status}`);
          }
        } else if (error.request) {
          console.error('網路錯誤，請檢查網路連接');
        } else {
          console.error('請求配置錯誤');
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * GET 請求
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  /**
   * POST 請求
   */
  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * PUT 請求
   */
  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * DELETE 請求
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  /**
   * PATCH 請求
   */
  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }
}

// 導出單例
export const httpClient = new HttpClient();
