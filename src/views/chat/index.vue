<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import IconBtn from '@/components/base/IconBtn.vue';
import { useFilePreview } from '@/composables/useFilePreview';
import { useChatStore } from '@/stores/chat';

import ChatInput from './components/inputs/ChatInput.vue';
// Components
import ChatEmptyState from './components/messages/ChatEmptyState.vue';
import ChatMessage from './components/messages/ChatMessage.vue';
import TypingIndicator from './components/messages/TypingIndicator.vue';
// 引入文件預覽
import FilePreviewModal from './components/modals/FilePreviewModal.vue';
// Composables
import { useScrollControl } from './composables/useScrollControl';

const route = useRoute();
const chatStore = useChatStore();
const { isOpen } = useFilePreview();

// --- 資料邏輯 ---
const conversationId = computed(() => route.params.id as string | undefined);
const currentConversation = computed(() =>
  conversationId.value ? chatStore.conversations.find((c) => c.id === conversationId.value) : null
);

// 路由變化更新 Store
watch(
  conversationId,
  (newId) => {
    if (newId) chatStore.setCurrentConversation(newId);
  },
  { immediate: true }
);

// --- 滾動邏輯 ---
const messagesContainerRef = ref<HTMLElement | null>(null);
const { showScrollButton, scrollToBottom, checkScrollPosition } =
  useScrollControl(messagesContainerRef);

// 監聽訊息變化，自動滾動
watch(
  () => currentConversation.value?.messages,
  async () => {
    await nextTick();
    await scrollToBottom(false);
    nextTick(() => checkScrollPosition());
  },
  { deep: true }
);
</script>

<template>
  <div class="chat-page" :class="{ 'preview-open': isOpen }">
    <!-- 左側聊天主區域 -->
    <div ref="messagesContainerRef" class="chat-main-container scrollbar-custom">
      <main class="chat-content">
        <div class="messages-content-wrapper">
          <!-- 空狀態 -->
          <ChatEmptyState
            v-if="!currentConversation || currentConversation.messages.length === 0"
          />

          <!-- 訊息列表 -->
          <div v-else class="messages-list">
            <ChatMessage
              v-for="message in currentConversation.messages"
              :key="message.id"
              :message="message"
              :conversation-id="currentConversation.id"
            />

            <!-- 打字指示器 -->
            <TypingIndicator v-if="chatStore.isLoading" />

            <!-- 錯誤提示 -->
            <div v-if="chatStore.error" class="error-message">
              <div class="error-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div class="error-content">
                <p class="error-title">發生錯誤</p>
                <p class="error-description">{{ chatStore.error }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部間距 -->
        <div class="messages-bottom-spacing"></div>
      </main>

      <!-- 固定底部區域 -->
      <div class="chat-sticky-bottom">
        <Transition name="scroll-button-fade">
          <IconBtn
            v-if="showScrollButton"
            icon="ARROW_DOWN"
            label="滾動到最新"
            class="scroll-to-bottom-button"
            aria-label="滾動到最新"
            @click="scrollToBottom(true)"
          />
        </Transition>

        <div class="chat-input-wrapper">
          <ChatInput :conversation-id="conversationId" />
        </div>
      </div>
    </div>

    <!-- 右側預覽面板 (Split View) -->
    <FilePreviewModal />
  </div>
</template>

<style scoped>
/* ========== 佈局 ========== */
.chat-page {
  display: flex;
  flex-direction: row;
  height: 100%;
  overflow: hidden;
  background-color: var(--bg-primary);
}

.chat-main-container {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  height: 100%;
  overflow-y: auto;

  /* 移除 all，避免縮放時觸發 sticky re-layout 的動畫 */
  transition: opacity 0.3s ease;
  scroll-behavior: smooth;
}

/* 響應式：預覽開啟時，在小螢幕隱藏訊息列表 */
@media (width <= 1024px) {
  .preview-open .chat-main-container {
    display: none;
  }
}

.chat-content {
  position: relative;
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
}

.messages-content-wrapper {
  width: 100%;
  max-width: 56rem;
  padding: 0 1rem;
  margin: 0 auto;
}

.messages-list {
  padding: 1rem 0;
}

.messages-bottom-spacing {
  flex-shrink: 0;
  height: 140px;
}

.chat-sticky-bottom {
  position: sticky;
  bottom: 0;
  z-index: 30;
  margin-top: auto;
  pointer-events: none;
  background: transparent;
}

.chat-input-wrapper {
  pointer-events: auto;
  background-color: var(--bg-primary);
  border-top: 1px solid var(--border-secondary);
}

.scroll-to-bottom-button {
  position: absolute;
  top: -3.5rem;
  left: 50%;
  z-index: 20;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding: 0.75rem 1.25rem;
  color: var(--text-primary);
  white-space: nowrap;
  pointer-events: auto;
  cursor: pointer;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: 9999px;
  box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
  transform: translateX(-50%);
  transition: all 0.3s ease;
}

.error-message {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  max-width: 42rem;
  padding: 1.25rem 1.5rem;
  margin: 2rem auto;
  background-color: rgb(239 68 68 / 10%);
  border: 1px solid rgb(239 68 68 / 30%);
  border-radius: 0.75rem;
}

.error-icon {
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  color: var(--error);
}

.error-icon svg {
  width: 100%;
  height: 100%;
}

.error-content {
  flex: 1;
}

.error-title {
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--error);
}

.error-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.scroll-button-fade-enter-active,
.scroll-button-fade-leave-active {
  transition: all 0.3s ease;
}

.scroll-button-fade-enter-from,
.scroll-button-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

@media (width <=768px) {
  .messages-content-wrapper {
    padding: 0 0.75rem;
  }

  .scroll-to-bottom-button {
    top: -3rem;
    padding: 0.625rem 1rem;
  }
}
</style>
