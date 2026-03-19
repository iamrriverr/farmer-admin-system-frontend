/**
 * Knowledge API
 * 知識庫相關的 API 接口
 */

import type {
  ApiResponse,
  DeleteDocumentRequest,
  GetDocumentsRequest,
  KnowledgeDocument,
  PaginationResponse,
  UpdateDocumentRequest,
  UploadKnowledgeDocumentRequest,
} from '@/types';
import { httpClient } from '@/utils/request';

/**
 * 獲取文件列表
 */
export const getDocuments = async (
  params: GetDocumentsRequest
): Promise<ApiResponse<PaginationResponse<KnowledgeDocument>>> => {
  return httpClient.get<PaginationResponse<KnowledgeDocument>>('/knowledge/documents', {
    params,
  });
};

/**
 * 獲取文件詳情
 */
export const getDocument = async (documentId: string): Promise<ApiResponse<KnowledgeDocument>> => {
  return httpClient.get<KnowledgeDocument>(`/knowledge/documents/${documentId}`);
};

/**
 * 上傳文件
 */
export const uploadDocument = async (
  request: UploadKnowledgeDocumentRequest
): Promise<ApiResponse<KnowledgeDocument>> => {
  const formData = new FormData();
  formData.append('file', request.file);

  if (request.category) {
    formData.append('category', request.category);
  }

  if (request.tags) {
    formData.append('tags', JSON.stringify(request.tags));
  }

  if (request.description) {
    formData.append('description', request.description);
  }

  return httpClient.post<KnowledgeDocument>('/knowledge/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * 更新文件
 */
export const updateDocument = async (
  request: UpdateDocumentRequest
): Promise<ApiResponse<KnowledgeDocument>> => {
  const { documentId, ...data } = request;
  return httpClient.put<KnowledgeDocument>(`/knowledge/documents/${documentId}`, data);
};

/**
 * 刪除文件
 */
export const deleteDocument = async (
  request: DeleteDocumentRequest
): Promise<ApiResponse<void>> => {
  return httpClient.delete<void>(`/knowledge/documents/${request.documentId}`);
};

/**
 * 獲取文件分類列表
 */
export const getCategories = async (): Promise<ApiResponse<string[]>> => {
  return httpClient.get<string[]>('/knowledge/categories');
};
