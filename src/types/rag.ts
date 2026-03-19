/**
 * RAG 相關型別定義
 */

import type { Message } from './chat';

// 文件
export interface Document {
  id: string;
  filename: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Date;
  category?: string;
  tags?: string[];
  description?: string;
  chunks?: number; // 切片數量
  vectorized: boolean; // 是否已向量化
}

// 向量切片
export interface VectorChunk {
  id: string;
  documentId: string;
  content: string;
  vector: number[];
  metadata?: Record<string, unknown>;
}

// RAG 查詢請求
export interface RAGQueryRequest {
  conversationId?: string;
  query: string;
  useRAG: boolean;
  topK?: number; // 檢索前 K 個相關文件
}

// RAG 查詢回應
export interface RAGQueryResponse {
  conversationId: string;
  message: Message;
  references?: DocumentReference[];
}

// 文件引用
export interface DocumentReference {
  documentId: string;
  documentName: string;
  chunkId: string;
  content: string;
  relevanceScore: number; // 相關性分數
}

// 上傳文件請求
export interface UploadDocumentRequest {
  file: File;
  category?: string;
  tags?: string[];
  description?: string;
}

// 上傳文件回應
export interface UploadDocumentResponse {
  document: Document;
}
