<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import AsideLayout from './aside/index.vue';
import HeaderLayout from './header/index.vue';
import MainLayout from './main/index.vue';

const route = useRoute();

// 需要第二側邊欄的路由（目前僅 chat 需要，且必須是 /chat 或其子路徑）
const showSecondarySidebar = computed(() => {
  return route.path === '/chat' || route.path.startsWith('/chat/');
});

// 需要 Header 的路由（目前僅 chat）
const showHeader = computed(() => {
  return route.path === '/chat' || route.path.startsWith('/chat/');
});
</script>

<template>
  <div class="layout-container">
    <!-- 側邊欄（主 + 次） -->
    <AsideLayout :show-secondary="showSecondarySidebar" />

    <!-- Header（僅 chat 顯示） -->
    <HeaderLayout v-if="showHeader" />

    <!-- 主內容區 -->
    <MainLayout :has-header="showHeader" :has-secondary="showSecondarySidebar" />
  </div>
</template>

<style scoped>
.layout-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: var(--bg-primary);
}
</style>
