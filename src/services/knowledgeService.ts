/**
 * Knowledge Service
 * 知識庫業務邏輯層
 */

import * as knowledgeApi from '@/api/knowledge';
import { UPLOAD } from '@/config';
import type {
  GetDocumentsRequest,
  KnowledgeDocument,
  UpdateDocumentRequest,
  UploadKnowledgeDocumentRequest,
} from '@/types';

export class KnowledgeService {
  /**
   * 獲取文件列表
   */
  async getDocuments(params: GetDocumentsRequest): Promise<{
    items: KnowledgeDocument[];
    total: number;
  }> {
    try {
      const response = await knowledgeApi.getDocuments(params);
      return {
        items: response.data.items,
        total: response.data.total,
      };
    } catch (error) {
      console.error('獲取文件列表失敗:', error);
      throw error;
    }
  }

  /**
   * 獲取文件詳情
   */
  async getDocument(documentId: string): Promise<KnowledgeDocument> {
    try {
      const response = await knowledgeApi.getDocument(documentId);
      return response.data;
    } catch (error) {
      console.error('獲取文件詳情失敗:', error);
      throw error;
    }
  }

  /**
   * 上傳文件
   */
  async uploadDocument(request: UploadKnowledgeDocumentRequest): Promise<KnowledgeDocument> {
    try {
      // 驗證文件大小
      if (request.file.size > UPLOAD.MAX_FILE_SIZE) {
        throw new Error(`文件大小不能超過 ${UPLOAD.MAX_FILE_SIZE / 1024 / 1024}MB`);
      }

      // 驗證文件類型
      if (!UPLOAD.ALLOWED_FILE_TYPES.includes(request.file.type)) {
        throw new Error('不支援的文件類型');
      }

      const response = await knowledgeApi.uploadDocument(request);
      return response.data;
    } catch (error) {
      console.error('上傳文件失敗:', error);
      throw error;
    }
  }

  /**
   * 更新文件
   */
  async updateDocument(request: UpdateDocumentRequest): Promise<KnowledgeDocument> {
    try {
      const response = await knowledgeApi.updateDocument(request);
      return response.data;
    } catch (error) {
      console.error('更新文件失敗:', error);
      throw error;
    }
  }

  /**
   * 刪除文件
   */
  async deleteDocument(documentId: string): Promise<void> {
    try {
      await knowledgeApi.deleteDocument({ documentId });
    } catch (error) {
      console.error('刪除文件失敗:', error);
      throw error;
    }
  }

  /**
   * 獲取文件分類列表
   */
  async getCategories(): Promise<string[]> {
    try {
      const response = await knowledgeApi.getCategories();
      return response.data;
    } catch (error) {
      console.error('獲取分類列表失敗:', error);
      throw error;
    }
  }

  /**
   * 批量刪除文件
   */
  async batchDeleteDocuments(documentIds: string[]): Promise<void> {
    try {
      await Promise.all(documentIds.map((id) => this.deleteDocument(id)));
    } catch (error) {
      console.error('批量刪除文件失敗:', error);
      throw error;
    }
  }
}

// 導出單例
export const knowledgeService = new KnowledgeService();
