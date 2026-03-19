/**
 * 文件上傳狀態
 */
export type UploadStatus = 'pending' | 'uploading' | 'success' | 'error';

/**
 * 上傳的文件信息
 */
export interface UploadedFile {
  id: string; // 唯一標識
  file: File; // 原始文件對象
  name: string; // 文件名
  size: number; // 文件大小（字節）
  type: string; // MIME 類型
  status: UploadStatus; // 上傳狀態
  progress: number; // 上傳進度（0-100）
  url?: string; // 上傳後的 URL
  error?: string; // 錯誤信息
  createdAt: Date; // 創建時間
}

/**
 * 文件上傳配置
 */
export interface UploadConfig {
  maxSize?: number; // 單個文件最大大小（字節），默認 10MB
  maxCount?: number; // 最大文件數量，默認 5
  accept?: string[]; // 允許的文件類型（MIME 類型或擴展名）
  multiple?: boolean; // 是否允許多選
  autoUpload?: boolean; // 是否自動上傳
}

/**
 * 文件上傳請求參數
 */
export interface UploadRequest {
  file: File;
  onProgress?: (progress: number) => void;
  onSuccess?: (url: string) => void;
  onError?: (error: Error) => void;
}

/**
 * 文件上傳響應
 */
export interface UploadResponse {
  success: boolean;
  url?: string;
  fileId?: string;
  message?: string;
}

/**
 * 文件驗證結果
 */
export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * 支持的文件類型配置
 */
export const SUPPORTED_FILE_TYPES = {
  // 文檔
  PDF: { mime: 'application/pdf', ext: '.pdf', icon: '📄' },
  DOCX: {
    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ext: '.docx',
    icon: '📝',
  },
  XLSX: {
    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ext: '.xlsx',
    icon: '📊',
  },
  TXT: { mime: 'text/plain', ext: '.txt', icon: '📃' },

  // 其他（預留）
  DOC: { mime: 'application/msword', ext: '.doc', icon: '📝' },
  XLS: { mime: 'application/vnd.ms-excel', ext: '.xls', icon: '📊' },
} as const;

/**
 * 默認上傳配置
 */
export const DEFAULT_UPLOAD_CONFIG: Required<UploadConfig> = {
  maxSize: 10 * 1024 * 1024, // 10MB
  maxCount: 5,
  accept: [
    SUPPORTED_FILE_TYPES.PDF.mime,
    SUPPORTED_FILE_TYPES.DOCX.mime,
    SUPPORTED_FILE_TYPES.XLSX.mime,
    SUPPORTED_FILE_TYPES.TXT.mime,
  ],
  multiple: true,
  autoUpload: false,
};
