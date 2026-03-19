import { computed, type Ref, ref } from 'vue';

import { useChatStore } from '@/stores/chat';
import type { DocumentReference, Message } from '@/types';

/**
 * useChat Composable 配置選項
 */
export interface UseChatOptions {
  conversationId?: string;
  enableRAG?: boolean;
  enableStreaming?: boolean;
  typewriterSpeed?: number; // ms per character
}

/**
 * useChat Composable 返回值
 */
export interface UseChatReturn {
  // 狀態
  messages: Ref<Message[]>;
  isLoading: Ref<boolean>;
  isStreaming: Ref<boolean>;
  error: Ref<string | null>;

  // 消息操作
  sendMessage: (content: string) => Promise<void>;
  regenerateMessage: (messageId: string) => Promise<void>;
  copyMessage: (messageId: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;

  // 流式響應（預留）
  streamingContent: Ref<string>;
  stopStreaming: () => void;

  // 文件引用
  references: Ref<DocumentReference[]>;
  showReferences: Ref<boolean>;
  toggleReferences: () => void;

  // 打字機效果（預留）
  typewriterEnabled: Ref<boolean>;
  typewriterSpeed: Ref<number>;
}

/**
 * useChat Composable
 * 處理單個對話的交互邏輯
 */
export const useChat = (options: UseChatOptions = {}): UseChatReturn => {
  const chatStore = useChatStore();

  // 配置
  const conversationId = ref(options.conversationId);
  const enableRAG = ref(options.enableRAG ?? false);
  const enableStreaming = ref(options.enableStreaming ?? false);
  const typewriterSpeed = ref(options.typewriterSpeed ?? 30);

  // 狀態
  const isLoading = ref(false);
  const isStreaming = ref(false);
  const error = ref<string | null>(null);
  const streamingContent = ref('');
  const references = ref<DocumentReference[]>([]);
  const showReferences = ref(true);
  const typewriterEnabled = ref(false);

  // 計算屬性：當前對話的消息列表
  const messages = computed(() => {
    if (!conversationId.value) return [];

    const conversation = chatStore.conversations.find((c) => c.id === conversationId.value);
    return conversation?.messages || [];
  });

  /**
   * 發送消息
   */
  const sendMessage = async (content: string): Promise<void> => {
    if (!content.trim()) return;

    try {
      isLoading.value = true;
      error.value = null;

      // 使用 Store 的 sendMessage 方法（已包含樂觀更新）
      const newConversationId = await chatStore.sendMessage(
        conversationId.value,
        content,
        undefined,
        enableRAG.value
      );

      // 如果是新對話，更新 conversationId
      if (!conversationId.value) {
        conversationId.value = newConversationId;
      }

      // TODO: 處理流式響應
      if (enableStreaming.value) {
        // await handleStreamingResponse(newConversationId, content);
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '發送消息失敗';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 重新生成消息
   */
  const regenerateMessage = async (messageId: string): Promise<void> => {
    if (!conversationId.value) return;

    try {
      isLoading.value = true;
      error.value = null;

      const conversation = chatStore.conversations.find((c) => c.id === conversationId.value);
      if (!conversation) throw new Error('對話不存在');

      // 找到要重新生成的消息
      const messageIndex = conversation.messages.findIndex((m) => m.id === messageId);
      if (messageIndex === -1) throw new Error('消息不存在');

      const message = conversation.messages[messageIndex];
      if (message.role !== 'assistant') throw new Error('只能重新生成 AI 消息');

      // 找到上一條用戶消息
      let userMessageContent = '';
      for (let i = messageIndex - 1; i >= 0; i--) {
        if (conversation.messages[i].role === 'user') {
          userMessageContent = conversation.messages[i].content;
          break;
        }
      }

      if (!userMessageContent) throw new Error('找不到對應的用戶消息');

      // 刪除舊的 AI 消息
      conversation.messages.splice(messageIndex, 1);

      // 重新發送請求
      await chatStore.sendMessage(
        conversationId.value,
        userMessageContent,
        undefined,
        enableRAG.value
      );
    } catch (err) {
      error.value = err instanceof Error ? err.message : '重新生成失敗';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 複製消息到剪貼板
   */
  const copyMessage = async (messageId: string): Promise<void> => {
    try {
      const conversation = chatStore.conversations.find((c) => c.id === conversationId.value);
      if (!conversation) throw new Error('對話不存在');

      const message = conversation.messages.find((m) => m.id === messageId);
      if (!message) throw new Error('消息不存在');

      await navigator.clipboard.writeText(message.content);
    } catch (err) {
      error.value = err instanceof Error ? err.message : '複製失敗';
      throw err;
    }
  };

  /**
   * 刪除消息
   */
  const deleteMessage = async (messageId: string): Promise<void> => {
    if (!conversationId.value) return;

    try {
      const conversation = chatStore.conversations.find((c) => c.id === conversationId.value);
      if (!conversation) throw new Error('對話不存在');

      const messageIndex = conversation.messages.findIndex((m) => m.id === messageId);
      if (messageIndex === -1) throw new Error('消息不存在');

      // 刪除消息
      conversation.messages.splice(messageIndex, 1);
    } catch (err) {
      error.value = err instanceof Error ? err.message : '刪除失敗';
      throw err;
    }
  };

  /**
   * 停止流式響應（預留）
   */
  const stopStreaming = (): void => {
    isStreaming.value = false;
    streamingContent.value = '';
  };

  /**
   * 切換引用顯示
   */
  const toggleReferences = (): void => {
    showReferences.value = !showReferences.value;
  };

  return {
    // 狀態
    messages,
    isLoading,
    isStreaming,
    error,

    // 消息操作
    sendMessage,
    regenerateMessage,
    copyMessage,
    deleteMessage,

    // 流式響應
    streamingContent,
    stopStreaming,

    // 文件引用
    references,
    showReferences,
    toggleReferences,

    // 打字機效果
    typewriterEnabled,
    typewriterSpeed,
  };
};
