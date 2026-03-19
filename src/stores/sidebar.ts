import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { ModuleType } from '@/types';

export const useSidebarStore = defineStore(
  'sidebar',
  () => {
    const activeModule = ref<ModuleType>('conversation');
    const isSecondaryExpanded = ref<boolean>(true); // 預設展開（如 ChatGPT）

    const setActiveModule = (module: ModuleType): void => {
      // 如果點擊的是當前模組，則切換展開狀態
      if (activeModule.value === module) {
        isSecondaryExpanded.value = !isSecondaryExpanded.value;
      } else {
        activeModule.value = module;
        isSecondaryExpanded.value = true;
      }
    };

    const toggleSecondary = (): void => {
      isSecondaryExpanded.value = !isSecondaryExpanded.value;
    };

    const setSecondaryExpanded = (value: boolean): void => {
      isSecondaryExpanded.value = value;
    };

    return {
      activeModule,
      isSecondaryExpanded,
      setActiveModule,
      toggleSecondary,
      setSecondaryExpanded,
    };
  },
  {
    persist: true,
  }
);
