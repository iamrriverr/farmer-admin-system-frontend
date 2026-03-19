/**
 * Chat API
 * 聊天相關的 API 接口
 */

import type {
  ApiResponse,
  Conversation,
  Message,
  PaginationParams,
  PaginationResponse,
  RAGQueryRequest,
  RAGQueryResponse,
} from '@/types';
import { httpClient } from '@/utils/request';

/**
 * 發送訊息
 */
export const sendMessage = async (
  conversationId: string | undefined,
  content: string,
  useRAG = false
): Promise<ApiResponse<RAGQueryResponse>> => {
  const payload: RAGQueryRequest = {
    conversationId,
    query: content,
    useRAG,
  };

  return httpClient.post<RAGQueryResponse>('/chat/message', payload);
};

/**
 * 獲取對話列表
 */
export const getConversations = async (
  params: PaginationParams
): Promise<ApiResponse<PaginationResponse<Conversation>>> => {
  return httpClient.get<PaginationResponse<Conversation>>('/chat/conversations', {
    params,
  });
};

/**
 * 獲取對話詳情
 */
export const getConversation = async (
  conversationId: string
): Promise<ApiResponse<Conversation>> => {
  return httpClient.get<Conversation>(`/chat/conversations/${conversationId}`);
};

/**
 * 創建新對話
 */
export const createConversation = async (title?: string): Promise<ApiResponse<Conversation>> => {
  return httpClient.post<Conversation>('/chat/conversations', { title });
};

/**
 * 刪除對話
 */
export const deleteConversation = async (conversationId: string): Promise<ApiResponse<void>> => {
  return httpClient.delete<void>(`/chat/conversations/${conversationId}`);
};

/**
 * 獲取對話訊息列表
 */
export const getMessages = async (
  conversationId: string,
  params: PaginationParams
): Promise<ApiResponse<PaginationResponse<Message>>> => {
  return httpClient.get<PaginationResponse<Message>>(
    `/chat/conversations/${conversationId}/messages`,
    { params }
  );
};
