import { storeToRefs } from 'pinia';

import { useSidebarStore } from '@/stores/sidebar';
import type { ModuleType } from '@/types';

export const useSidebar = () => {
  const sidebarStore = useSidebarStore();

  const { activeModule, isSecondaryExpanded } = storeToRefs(sidebarStore);

  const setActiveModule = (module: ModuleType): void => {
    sidebarStore.setActiveModule(module);
  };

  const toggleSecondary = (): void => {
    sidebarStore.toggleSecondary();
  };

  const setSecondaryExpanded = (value: boolean): void => {
    sidebarStore.setSecondaryExpanded(value);
  };

  return {
    activeModule,
    isSecondaryExpanded,
    setActiveModule,
    toggleSecondary,
    setSecondaryExpanded,
  };
};
