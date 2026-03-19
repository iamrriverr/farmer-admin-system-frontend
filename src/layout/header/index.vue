<script setup lang="ts">
import { useSidebarStore } from '@/stores/sidebar';

import HeaderTitle from './HeaderTitle.vue';

const sidebarStore = useSidebarStore();
</script>

<template>
  <header class="app-header">
    <HeaderTitle />
  </header>
</template>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 60;
  box-sizing: border-box;
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
  padding: 0 1.5rem;
  background-color: var(--bg-primary);

  /* 修正：指定動畫屬性，避免主題切換時背景色彩過渡產生的黑閃 */
  transition:
    margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 預設寬度設定 (寬螢幕跟隨 Store) */
@media (width >= 1025px) {
  .app-header {
    width: v-bind('sidebarStore.isSecondaryExpanded ? "calc(100% - 336px)" : "calc(100% - 80px)"');
    margin-left: v-bind('sidebarStore.isSecondaryExpanded ? "336px" : "80px"');
  }
}

/* 1024px 以下（或高縮放）：側邊欄改為覆蓋模式，Header 保持 80px 邊距避開 MainSidebar */
@media (width <= 1024px) {
  .app-header {
    width: calc(100% - 80px);
    margin-left: 80px;
  }
}
</style>
