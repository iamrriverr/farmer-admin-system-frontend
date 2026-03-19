<script setup lang="ts">
import MainSidebar from './MainSidebar.vue';
import SecondarySidebar from './SecondarySidebar.vue';

interface Props {
  showSecondary?: boolean;
}

withDefaults(defineProps<Props>(), {
  showSecondary: false,
});
</script>

<template>
  <aside class="sidebar-container">
    <MainSidebar />
    <SecondarySidebar v-if="showSecondary" />
  </aside>
</template>

<style scoped>
.sidebar-container {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 70;
  display: flex;
  height: 100vh;
}
</style>
