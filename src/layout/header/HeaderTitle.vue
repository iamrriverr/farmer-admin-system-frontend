<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { useChatStore } from '@/stores/chat';

const route = useRoute();
const chatStore = useChatStore();

const displayTitle = computed(() => {
  // ✅ 如果在聊天頁面，顯示對話標題
  if (route.name === 'chat' && route.params.id) {
    const conversationId = route.params.id as string;
    const conversation = chatStore.conversations.find((c) => c.id === conversationId);

    if (conversation && conversation.messages.length > 0) {
      // 取第一條訊息作為標題，限制長度
      const firstMessage = conversation.messages[0].content;
      return firstMessage.length > 30 ? firstMessage.substring(0, 30) + '...' : firstMessage;
    }
  }

  // ✅ 根據路由顯示標題
  const routeTitles: Record<string, string> = {
    chat: 'AI 聊天助手',
    conversation: '對話歷史',
    settings: '設定',
    home: '首頁',
  };

  return routeTitles[route.name as string] || 'AI 聊天助手';
});
</script>

<template>
  <div class="header-title">
    <h1 class="title-text">{{ displayTitle }}</h1>
  </div>
</template>

<style scoped>
.header-title {
  display: flex;
  flex: 1;
  align-items: center;
  min-width: 0;
}

.title-text {
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
}
</style>
