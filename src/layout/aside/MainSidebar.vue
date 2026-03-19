<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { usePermission } from '@/composables/usePermission';
import { NAVIGATION_ITEMS } from '@/constants/navigation';
import { useSidebarStore } from '@/stores/sidebar';
import type { MenuItem } from '@/types';

import SidebarLogo from './SidebarLogo.vue';
import SidebarMenu from './SidebarMenu.vue';
import UserMenu from './UserMenu.vue';

const sidebarStore = useSidebarStore();
const router = useRouter();
const route = useRoute();
const { hasRoutePermission } = usePermission();

const showUserMenu = ref(false);

// 根據權限過濾選單項目
const filteredMenuItems = computed(() => {
  return NAVIGATION_ITEMS.filter((item) => {
    // 新對話和對話歷史不需要權限檢查（所有登入使用者都可以使用）
    if (item.id === 'new-chat' || item.id === 'conversation') {
      return true;
    }
    // 其他選單項目需要檢查權限
    return hasRoutePermission(item.route);
  });
});

const userItem: MenuItem = {
  id: 'new-chat', // 使用 new-chat 作為預設值（不會實際使用）
  icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  label: '使用者設定',
  route: '', // 彈窗處理
};

const handleItemClick = (item: MenuItem): void => {
  // 1. 先處理 Store 狀態（主模組切換，觸發相關 UI 反應）
  sidebarStore.setActiveModule(item.id);

  // 2. 處理「新對話」特殊邏輯
  if (item.id === 'new-chat') {
    router.push('/chat');
    sidebarStore.setSecondaryExpanded(true);
    sidebarStore.activeModule = 'conversation';
    return;
  }

  // 3. 通用路由跳轉（若目標路徑與當前不同則觸發）
  if (item.route && route.path !== item.route) {
    router.push(item.route);
  }
};
</script>

<template>
  <div class="main-sidebar">
    <div class="logo-container">
      <SidebarLogo />
    </div>

    <nav class="menu-nav">
      <div class="menu-items-top scrollbar-custom">
        <SidebarMenu v-for="item in filteredMenuItems" :key="item.id" :item="item"
          :is-active="sidebarStore.activeModule === item.id" :is-new-chat="item.id === 'new-chat'"
          @click="handleItemClick(item)" />
      </div>

      <div class="menu-items-bottom">
        <SidebarMenu :item="userItem" :is-active="showUserMenu" :suppress-tooltip="showUserMenu"
          @click="showUserMenu = !showUserMenu" />
        <UserMenu v-if="showUserMenu" @close="showUserMenu = false" />
      </div>
    </nav>
  </div>
</template>

<style scoped>
.main-sidebar {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 5rem;
  height: 100vh;
  padding: 1.5rem 0 0;
  background-color: var(--bg-secondary);
}

.logo-container {
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  margin-bottom: 2rem;
}

.menu-nav {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}

.menu-items-top {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0 0.75rem;
  overflow: hidden auto;
}

.menu-items-bottom {
  position: relative;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  padding: 1rem 0.75rem 1.5rem;
  margin-top: auto;
  background-color: var(--bg-secondary);
}
</style>
