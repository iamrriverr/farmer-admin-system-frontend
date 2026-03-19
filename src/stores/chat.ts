import { defineStore } from 'pinia';
import { ref } from 'vue';

import { CHAT } from '@/config';
import { getMockAIResponse } from '@/mock/chat';
// TODO: 連接後端 API 時啟用
// import { chatService } from '@/services';
import type { Conversation, Message } from '@/types';

export const useChatStore = defineStore(
  'chat',
  () => {
    const conversations = ref<Conversation[]>([]);
    const currentConversationId = ref<string | null>(null);
    const isLoading = ref<boolean>(false);
    const error = ref<string | null>(null);

    /**
     * 創建新對話（本地）
     */
    const createConversation = (): Conversation => {
      const newConversation: Conversation = {
        id: `conv_${Date.now()}`,
        title: '新對話',
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      conversations.value.unshift(newConversation);
      currentConversationId.value = newConversation.id;
      return newConversation;
    };

    /**
     * 設置當前對話
     */
    const setCurrentConversation = (conversationId: string): void => {
      currentConversationId.value = conversationId;
    };

    /**
     * 刪除對話
     */
    const deleteConversation = async (conversationId: string): Promise<void> => {
      try {
        // TODO: 連接後端 API 時啟用
        // await chatService.deleteConversation(conversationId);

        // 本地刪除
        const index = conversations.value.findIndex((c) => c.id === conversationId);
        if (index !== -1) {
          conversations.value.splice(index, 1);
        }

        // 如果刪除的是當前對話，清除當前對話 ID
        if (currentConversationId.value === conversationId) {
          currentConversationId.value = null;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        error.value = err instanceof Error ? err.message : '刪除對話失敗';
        throw err;
      }
    };

    /**
     * 發送訊息（樂觀更新）
     */
    const sendMessage = async (
      conversationId: string | undefined,
      content: string,
      attachments?: import('@/types').UploadedFile[],
      useRAG = true
    ): Promise<string> => {
      let targetConversationId = conversationId;

      try {
        // 1. 立即創建或獲取對話
        if (!targetConversationId) {
          const newConv = createConversation();
          targetConversationId = newConv.id;
        }

        const conversation = conversations.value.find((c) => c.id === targetConversationId);
        if (!conversation) throw new Error('對話不存在');

        // 2. 立即添加用戶訊息（樂觀更新）
        const userMessage: Message = {
          id: `msg_${Date.now()}`,
          content,
          role: 'user',
          timestamp: new Date(),
          attachments, // 添加附件
        };

        conversation.messages.push(userMessage);

        // 3. 如果是第一條訊息，立即更新標題
        if (conversation.messages.length === 1) {
          conversation.title =
            content.slice(0, CHAT.MAX_CONVERSATION_TITLE_LENGTH) +
            (content.length > CHAT.MAX_CONVERSATION_TITLE_LENGTH ? '...' : '');
        }

        conversation.updatedAt = new Date();

        // 4. 背景處理 AI 回覆
        handleAIResponse(targetConversationId, content, useRAG);

        return targetConversationId;
      } catch (err) {
        error.value = err instanceof Error ? err.message : '發送訊息失敗';
        throw err;
      }
    };

    /**
     * 背景處理 AI 回覆
     */
    const handleAIResponse = async (
      conversationId: string,
      userMessage: string,
      useRAG: boolean
    ): Promise<void> => {
      try {
        isLoading.value = true;
        error.value = null;

        const conversation = conversations.value.find((c) => c.id === conversationId);
        if (!conversation) return;

        // Mock 開關邏輯
        if (import.meta.env.VITE_USE_MOCK === 'true') {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const aiMessage = getMockAIResponse(userMessage, useRAG);
          conversation.messages.push(aiMessage);
          conversation.updatedAt = new Date();
          return;
        }

        // TODO: 連接後端 API 時啟用
        // const response = await chatService.sendMessage(conversationId, userMessage, useRAG);
        // const aiMessage = response.message;
        // if (response.references) {
        //   // 處理 RAG 引用
        // }
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'AI 回覆失敗';
      } finally {
        isLoading.value = false;
      }
    };

    /**
     * 載入對話列表（從後端）
     */
    const loadConversations = async (): Promise<void> => {
      try {
        isLoading.value = true;
        error.value = null;

        // TODO: 連接後端 API 時啟用
        // const loadedConversations = await chatService.getConversations();
        // conversations.value = loadedConversations;
      } catch (err) {
        error.value = err instanceof Error ? err.message : '載入對話列表失敗';
      } finally {
        isLoading.value = false;
      }
    };

    return {
      conversations,
      currentConversationId,
      isLoading,
      error,
      createConversation,
      setCurrentConversation,
      deleteConversation,
      sendMessage,
      loadConversations,
    };
  },
  {
    persist: {
      key: 'chat-state',
      pick: ['conversations'],
    },
  }
);
