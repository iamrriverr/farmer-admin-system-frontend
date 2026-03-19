<script setup lang="ts">
import { useRouter } from 'vue-router';

import farmersLogo from '@/assets/images/national_farmers_logo.png';
import { useSidebarStore } from '@/stores/sidebar';

const router = useRouter();
const sidebarStore = useSidebarStore();

const handleLogoClick = (): void => {
  router.push('/chat');
  sidebarStore.setActiveModule('conversation'); // 更新側邊欄狀態
};
</script>

<template>
  <button class="logo-button" title="返回首頁" @click="handleLogoClick">
    <img :src="farmersLogo" alt="農會 LOGO" class="logo-image" />
  </button>
</template>

<style scoped>
.logo-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  background-color: transparent;
  border: none;
  border-radius: 0.75rem;
}

.logo-button:hover {
  background-color: var(--bg-secondary);
  transform: scale(1.05);
  transition:
    transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    background-color 0.2s ease;
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
