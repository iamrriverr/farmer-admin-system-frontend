/**
 * 知識庫相關型別定義
 */

// 知識庫文件
export interface KnowledgeDocument {
  id: string;
  title: string;            // 文件顯示標題
  filename: string;         // 原始檔名
  fileSize: number;         // 位元組
  mimeType: string;
  category: string;         // 分類（業務規章、業務流程、法規、內部知識）
  department: string;       // 所屬部門（空字串表示全體可見）
  tags: string[];
  description?: string;
  uploadedBy: string;       // 上傳者姓名
  uploadedAt: string;
  updatedAt: string;
  status: DocumentStatus;
  chunkCount: number;       // RAG 切片數量
}

// 新增/編輯文件表單
export interface DocumentFormData {
  title: string;
  category: string;
  department: string;
  tags: string[];
  description: string;
}

// 文件狀態
export enum DocumentStatus {
  UPLOADING = 'uploading',
  PROCESSING = 'processing',
  READY = 'ready',
  ERROR = 'error',
}

// 文件分類
export interface DocumentCategory {
  id: string;
  name: string;
  description?: string;
  count: number; // 該分類下的文件數量
}

// 獲取文件列表請求
export interface GetDocumentsRequest {
  page: number;
  pageSize: number;
  category?: string;
  keyword?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'filename';
  sortOrder?: 'asc' | 'desc';
}

// 上傳文件請求
export interface UploadKnowledgeDocumentRequest {
  file: File;
  category?: string;
  tags?: string[];
  description?: string;
}

// 更新文件請求
export interface UpdateDocumentRequest {
  documentId: string;
  category?: string;
  tags?: string[];
  description?: string;
}

// 刪除文件請求
export interface DeleteDocumentRequest {
  documentId: string;
}
