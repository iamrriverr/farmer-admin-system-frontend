<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useChatStore } from '@/stores/chat';

import DeleteConfirmModal from './modals/DeleteConfirmModal.vue';

/**
 * 對話歷史組件
 * 顯示所有對話列表，支援切換與刪除
 */

const router = useRouter();
const route = useRoute();
const chatStore = useChatStore();

const activeConversationId = computed(() => route.params.id as string | undefined);

const showDeleteModal = ref(false);
const conversationToDelete = ref<string | null>(null);

const handleChatClick = (conversationId: string): void => {
  router.push(`/chat/${conversationId}`);
};

const handleDeleteClick = (conversationId: string, event: Event): void => {
  event.stopPropagation();
  conversationToDelete.value = conversationId;
  showDeleteModal.value = true;
};

const confirmDelete = (): void => {
  if (conversationToDelete.value) {
    chatStore.deleteConversation(conversationToDelete.value);
    if (activeConversationId.value === conversationToDelete.value) {
      router.push('/chat');
    }
    showDeleteModal.value = false;
    conversationToDelete.value = null;
  }
};

const cancelDelete = (): void => {
  showDeleteModal.value = false;
  conversationToDelete.value = null;
};

const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');

  return `${month}月${day}日 ${hours}:${minutes}`;
};
</script>

<template>
  <div class="chat-history">
    <!-- Header（固定在頂部） -->
    <div class="history-header">
      <h2 class="history-title">對話歷史</h2>
    </div>

    <!-- Chat List（可滾動區域） -->
    <div class="chat-list scrollbar-custom">
      <div class="chat-list-content">
        <!-- 空狀態 -->
        <div v-if="chatStore.conversations.length === 0" class="empty-state">
          <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p class="empty-text">尚無對話記錄</p>
          <p class="empty-hint">點擊左側「＋」開始新對話</p>
        </div>

        <!-- 記錄項列表 -->
        <div
          v-for="conversation in chatStore.conversations"
          :key="conversation.id"
          class="conversation-item"
          :class="{ active: activeConversationId === conversation.id }"
          @click="handleChatClick(conversation.id)"
        >
          <div class="conversation-content">
            <h4 class="conversation-title">{{ conversation.title }}</h4>
            <span class="conversation-time">{{ formatDateTime(conversation.updatedAt) }}</span>
          </div>

          <button
            class="delete-button"
            @click="handleDeleteClick(conversation.id, $event)"
            title="刪除對話"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <DeleteConfirmModal v-if="showDeleteModal" @confirm="confirmDelete" @cancel="cancelDelete" />
  </div>
</template>

<style scoped>
.chat-history {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  /* 防止溢出外部容器 */
}

/* 固定標頭 */
.history-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;

  /* 與 HeaderLayout 對齊 */
  padding: 0 1rem;
  background-color: var(--bg-secondary);
}

.history-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

/* 可滾動列表 */
.chat-list {
  flex: 1;
  min-height: 0;

  /* 重要：允許 flex 子項收縮 */
  overflow-y: auto;
}

.chat-list-content {
  padding: 0.75rem 0.5rem;
}

/* 空狀態 */
.empty-state {
  padding: 3rem 1rem;
  text-align: center;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  margin: 0 auto 0.75rem;
  color: var(--text-tertiary);
}

.empty-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.empty-hint {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

/* 對話列表項 */
.conversation-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem;
  margin-bottom: 0.375rem;
  cursor: pointer;
  background-color: transparent;
  border-radius: 0.75rem;
}

.conversation-item:hover {
  background-color: var(--bg-tertiary);
  transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.conversation-item.active {
  background-color: var(--bg-tertiary);
  box-shadow: 0 2px 8px rgb(0 0 0 / 5%);
}

.conversation-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.conversation-title {
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
}

.conversation-time {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

/* 刪除按鈕 */
.delete-button {
  flex-shrink: 0;
  padding: 0.5rem;
  color: var(--text-tertiary);
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 0.5rem;
  opacity: 0;
  transition: all 0.2s;
}

.conversation-item:hover .delete-button {
  opacity: 1;
}

.delete-button:hover {
  color: var(--error);
  background-color: color-mix(in srgb, var(--error) 10%, transparent);
}
</style>
