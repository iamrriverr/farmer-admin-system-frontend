/**
 * Chat Service
 * 聊天業務邏輯層
 */

import * as chatApi from '@/api/chat';
import type { Conversation, Message, RAGQueryResponse } from '@/types';

export class ChatService {
  /**
   * 發送訊息
   */
  async sendMessage(
    conversationId: string | undefined,
    content: string,
    useRAG = false
  ): Promise<RAGQueryResponse> {
    try {
      const response = await chatApi.sendMessage(conversationId, content, useRAG);
      return response.data;
    } catch (error) {
      console.error('發送訊息失敗:', error);
      throw error;
    }
  }

  /**
   * 獲取對話列表
   */
  async getConversations(page = 1, pageSize = 20): Promise<Conversation[]> {
    try {
      const response = await chatApi.getConversations({ page, pageSize });
      return response.data.items;
    } catch (error) {
      console.error('獲取對話列表失敗:', error);
      throw error;
    }
  }

  /**
   * 獲取對話詳情
   */
  async getConversation(conversationId: string): Promise<Conversation> {
    try {
      const response = await chatApi.getConversation(conversationId);
      return response.data;
    } catch (error) {
      console.error('獲取對話詳情失敗:', error);
      throw error;
    }
  }

  /**
   * 創建新對話
   */
  async createConversation(title?: string): Promise<Conversation> {
    try {
      const response = await chatApi.createConversation(title);
      return response.data;
    } catch (error) {
      console.error('創建對話失敗:', error);
      throw error;
    }
  }

  /**
   * 刪除對話
   */
  async deleteConversation(conversationId: string): Promise<void> {
    try {
      await chatApi.deleteConversation(conversationId);
    } catch (error) {
      console.error('刪除對話失敗:', error);
      throw error;
    }
  }

  /**
   * 獲取對話訊息列表
   */
  async getMessages(conversationId: string, page = 1, pageSize = 50): Promise<Message[]> {
    try {
      const response = await chatApi.getMessages(conversationId, { page, pageSize });
      return response.data.items;
    } catch (error) {
      console.error('獲取訊息列表失敗:', error);
      throw error;
    }
  }
}

// 導出單例
export const chatService = new ChatService();
