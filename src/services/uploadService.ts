/**
 * Upload Service
 * 文件上傳業務邏輯層
 */

import type { UploadRequest, UploadResponse } from '@/types';

export class UploadService {
  /**
   * 上傳單個文件
   */
  async uploadFile(request: UploadRequest): Promise<UploadResponse> {
    const { file, onProgress, onSuccess, onError } = request;

    try {
      // 創建 FormData
      const formData = new FormData();
      formData.append('file', file);

      // 使用 XMLHttpRequest 以支持進度追蹤
      return await new Promise<UploadResponse>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // 監聽上傳進度
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            onProgress?.(progress);
          }
        };

        // 監聽完成
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response: UploadResponse = JSON.parse(xhr.responseText);
              if (response.success && response.url) {
                onSuccess?.(response.url);
              }
              resolve(response);
            } catch {
              const error = new Error('解析響應失敗');
              onError?.(error);
              reject(error);
            }
          } else {
            const error = new Error(`上傳失敗: ${xhr.statusText}`);
            onError?.(error);
            reject(error);
          }
        };

        // 監聽錯誤
        xhr.onerror = () => {
          const error = new Error('網絡錯誤');
          onError?.(error);
          reject(error);
        };

        // 發送請求
        // TODO: 替換為實際的上傳端點
        xhr.open('POST', '/api/upload');
        xhr.send(formData);
      });
    } catch (error) {
      console.error('上傳文件失敗:', error);
      throw error;
    }
  }

  /**
   * 批量上傳文件
   */
  async uploadFiles(files: File[]): Promise<UploadResponse[]> {
    const uploadPromises = files.map((file) =>
      this.uploadFile({
        file,
      })
    );

    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('批量上傳失敗:', error);
      throw error;
    }
  }

  /**
   * 刪除已上傳的文件
   */
  async deleteFile(fileId: string): Promise<void> {
    try {
      // TODO: 連接後端 API
      const response = await fetch(`/api/upload/${fileId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('刪除文件失敗');
      }
    } catch (error) {
      console.error('刪除文件失敗:', error);
      throw error;
    }
  }
}

// 導出單例
export const uploadService = new UploadService();
