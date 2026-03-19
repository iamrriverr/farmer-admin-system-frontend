/**
 * API 相關型別定義
 */

// API 回應格式
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
  timestamp?: number;
}

// 分頁參數
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// 分頁回應
export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// API 錯誤碼
export enum ApiErrorCode {
  SUCCESS = 0,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,

  // RAG 相關
  RAG_DOCUMENT_UPLOAD_FAILED = 1001,
  RAG_QUERY_FAILED = 1002,
  RAG_DOCUMENT_NOT_FOUND = 1003,

  // 知識庫相關
  KNOWLEDGE_NOT_FOUND = 2001,
  KNOWLEDGE_UPLOAD_FAILED = 2002,
  KNOWLEDGE_DELETE_FAILED = 2003,

  // 表單相關
  FORM_GENERATION_FAILED = 3001,
  FORM_TEMPLATE_NOT_FOUND = 3002,
}
