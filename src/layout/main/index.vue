<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { useSidebarStore } from '@/stores/sidebar';

/**
 * 主佈局區域
 * 負責渲染頁面內容
 */

interface Props {
  hasHeader?: boolean;
  hasSecondary?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  hasHeader: false,
  hasSecondary: false,
});

const route = useRoute();
const sidebarStore = useSidebarStore();
const isSwitchingRoute = ref(false);

// 監聽路由變化，開啟靜默模式（無動畫）
watch(
  () => route.path,
  () => {
    isSwitchingRoute.value = true;
    setTimeout(() => {
      isSwitchingRoute.value = false;
    }, 100);
  }
);

const mainLayoutStyles = computed(() => {
  const marginLeft = !props.hasSecondary ? '80px' : (sidebarStore.isSecondaryExpanded ? '336px' : '80px');
  const width = `calc(100% - ${marginLeft})`;
  const paddingTop = props.hasHeader ? '4rem' : '0';

  return {
    marginLeft,
    width,
    paddingTop,
    // 如果正在切換路徑，則暫停動畫以防止擠壓
    transition: isSwitchingRoute.value 
      ? 'none' 
      : 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  };
});
</script>

<template>
  <main class="main-content" :style="mainLayoutStyles">
    <router-view />
  </main>
</template>

<style scoped>
.main-content {
  box-sizing: border-box;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: var(--bg-primary);
  /* 動態 transition, marginLeft 與 width 由 script 邏輯與 inline style 控制 */
}
</style>
