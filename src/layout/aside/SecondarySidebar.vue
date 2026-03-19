<script setup lang="ts">
import { useSidebarStore } from '@/stores/sidebar';
import ChatHistory from '@/views/chat/components/ChatHistory.vue';

const sidebarStore = useSidebarStore();
</script>

<template>
  <div class="secondary-sidebar" :class="{
    expanded: sidebarStore.isSecondaryExpanded,
  }">
    <div class="secondary-sidebar-content scrollbar-custom">
      <div v-if="
        sidebarStore.activeModule === 'conversation' || sidebarStore.activeModule === 'new-chat'
      " class="sidebar-section">
        <ChatHistory />
      </div>
    </div>
  </div>
</template>

<style scoped>
.secondary-sidebar {
  position: fixed;
  top: 0;
  left: 5rem;
  z-index: 30;
  visibility: hidden;
  width: 0;
  height: 100vh;
  overflow: hidden;
  pointer-events: none;
  background-color: var(--bg-secondary);
  opacity: 0;
  /* 統一動效：與 MainLayout 同步，避免內容跳動或回彈感 */
  transition:
    width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.secondary-sidebar.expanded {
  visibility: visible;
  width: 16rem;
  pointer-events: auto;
  opacity: 1;
}

.secondary-sidebar-content {
  width: 16rem;
  height: 100%;
  overflow: hidden auto;
}

.sidebar-section {
  padding: 0;
}

.section-title {
  padding: 1rem 1rem 0;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.section-placeholder {
  padding: 0 1rem;
  font-size: 0.875rem;
  color: var(--text-tertiary);
}
</style>
