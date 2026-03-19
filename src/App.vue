<script setup lang="ts">
import { RouterView } from 'vue-router';

import { useTheme } from '@/composables/useTheme';

const { initTheme } = useTheme();
initTheme();
</script>

<template>
  <div class="app-root">
    <RouterView />
  </div>
</template>

<style scoped>
.app-root {
  height: 100%;
  min-height: 100vh;
  color: var(--text-primary);
  background: var(--bg-primary);
}
</style>
