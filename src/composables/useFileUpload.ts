import { computed, type Ref, ref } from 'vue';

import { uploadService } from '@/services/uploadService';
import {
  DEFAULT_UPLOAD_CONFIG,
  type FileValidationResult,
  type UploadConfig,
  type UploadedFile,
} from '@/types';

/**
 * 文件上傳 Composable 返回值
 */
export interface UseFileUploadReturn {
  files: Ref<UploadedFile[]>; // 已上傳的文件列表
  isUploading: Ref<boolean>; // 是否正在上傳
  error: Ref<string | null>; // 錯誤信息
  totalProgress: Ref<number>; // 總體上傳進度

  // 操作方法
  selectFiles: () => void; // 打開文件選擇器
  handleFiles: (fileList: FileList | File[]) => Promise<void>; // 處理文件
  removeFile: (fileId: string) => void; // 移除文件
  clearFiles: () => void; // 清空所有文件
  uploadAll: () => Promise<void>; // 上傳所有文件

  // 驗證方法
  validateFile: (file: File) => FileValidationResult;
  canAddMore: () => boolean;
}

/**
 * 文件上傳 Composable
 */
export const useFileUpload = (config: UploadConfig = {}): UseFileUploadReturn => {
  // 合併配置
  const uploadConfig = { ...DEFAULT_UPLOAD_CONFIG, ...config };

  const files = ref<UploadedFile[]>([]);
  const isUploading = ref(false);
  const error = ref<string | null>(null);

  // 計算總體進度
  const totalProgress = computed(() => {
    if (files.value.length === 0) return 0;

    const total = files.value.reduce((sum, file) => sum + file.progress, 0);
    return Math.round(total / files.value.length);
  });

  /**
   * 驗證文件
   */
  const validateFile = (file: File): FileValidationResult => {
    // 檢查文件大小
    if (file.size > uploadConfig.maxSize) {
      const maxSizeMB = uploadConfig.maxSize / (1024 * 1024);
      return {
        valid: false,
        error: `文件大小超過限制（最大 ${maxSizeMB}MB）`,
      };
    }

    // 檢查文件類型
    const isValidType = uploadConfig.accept.some((acceptType) => {
      if (acceptType.startsWith('.')) {
        // 擴展名匹配
        return file.name.toLowerCase().endsWith(acceptType.toLowerCase());
      } else {
        // MIME 類型匹配
        return file.type === acceptType;
      }
    });

    if (!isValidType) {
      return {
        valid: false,
        error: '不支持的文件類型',
      };
    }

    return { valid: true };
  };

  /**
   * 檢查是否可以添加更多文件
   */
  const canAddMore = (): boolean => {
    return files.value.length < uploadConfig.maxCount;
  };

  /**
   * 處理文件列表
   */
  const handleFiles = async (fileList: FileList | File[]): Promise<void> => {
    error.value = null;

    const fileArray = Array.from(fileList);

    // 檢查數量限制
    if (files.value.length + fileArray.length > uploadConfig.maxCount) {
      error.value = `最多只能上傳 ${uploadConfig.maxCount} 個文件`;
      return;
    }

    // 驗證並添加文件
    for (const file of fileArray) {
      // 檢查是否重複（同名同大小）
      const isDuplicate = files.value.some((f) => f.name === file.name && f.size === file.size);

      if (isDuplicate) {
        // 顯示重複文件通知
        error.value = `您已上傳名為「${file.name}」的檔案`;
        continue;
      }

      const validation = validateFile(file);

      if (!validation.valid) {
        error.value = validation.error || '文件驗證失敗';
        continue;
      }

      const uploadedFile: UploadedFile = {
        id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'pending',
        progress: 0,
        createdAt: new Date(),
      };

      files.value.push(uploadedFile);

      // 如果啟用自動上傳
      if (uploadConfig.autoUpload) {
        await uploadFile(uploadedFile);
      }
    }
  };

  /**
   * 上傳單個文件
   */
  const uploadFile = async (uploadedFile: UploadedFile): Promise<void> => {
    uploadedFile.status = 'uploading';
    uploadedFile.progress = 0;

    try {
      const response = await uploadService.uploadFile({
        file: uploadedFile.file,
        onProgress: (progress) => {
          uploadedFile.progress = progress;
        },
        onSuccess: (url) => {
          uploadedFile.url = url;
          uploadedFile.status = 'success';
          uploadedFile.progress = 100;
        },
        onError: (err) => {
          uploadedFile.status = 'error';
          uploadedFile.error = err.message;
        },
      });

      if (!response.success) {
        throw new Error(response.message || '上傳失敗');
      }
    } catch (err) {
      uploadedFile.status = 'error';
      uploadedFile.error = err instanceof Error ? err.message : '上傳失敗';
      throw err;
    }
  };

  /**
   * 上傳所有待上傳的文件
   */
  const uploadAll = async (): Promise<void> => {
    const pendingFiles = files.value.filter((f) => f.status === 'pending');

    if (pendingFiles.length === 0) return;

    isUploading.value = true;
    error.value = null;

    try {
      await Promise.all(pendingFiles.map((file) => uploadFile(file)));
    } catch (err) {
      error.value = err instanceof Error ? err.message : '上傳失敗';
    } finally {
      isUploading.value = false;
    }
  };

  /**
   * 移除文件
   */
  const removeFile = (fileId: string): void => {
    const index = files.value.findIndex((f) => f.id === fileId);
    if (index !== -1) {
      files.value.splice(index, 1);
    }
  };

  /**
   * 清空所有文件
   */
  const clearFiles = (): void => {
    files.value = [];
    error.value = null;
  };

  /**
   * 打開文件選擇器
   */
  const selectFiles = (): void => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = uploadConfig.multiple;
    input.accept = uploadConfig.accept.join(',');

    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        handleFiles(target.files);
      }
    };

    input.click();
  };

  return {
    files,
    isUploading,
    error,
    totalProgress,
    selectFiles,
    handleFiles,
    removeFile,
    clearFiles,
    uploadAll,
    validateFile,
    canAddMore,
  };
};
