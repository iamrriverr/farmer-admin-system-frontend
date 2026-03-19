import { computed, onBeforeUnmount, onMounted, watch } from 'vue';

import { useThemeStore } from '@/stores/theme';
import { FA_DARK_CLASS, FA_MEDIA_QUERY_DARK } from '@/theme/config';
import type { AppliedTheme, ThemeMode } from '@/types/theme';

export function useTheme() {
  const themeStore = useThemeStore();
  let mediaQuery: MediaQueryList | null = null;

  /**
   * 獲取系統主題
   */
  const getSystemTheme = (): AppliedTheme => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia(FA_MEDIA_QUERY_DARK).matches ? 'dark' : 'light';
  };

  /**
   * 應用主題到 DOM
   * 切換 <html class="dark">
   */
  const applyTheme = (theme: AppliedTheme): void => {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add(FA_DARK_CLASS);
    } else {
      root.classList.remove(FA_DARK_CLASS);
    }

    themeStore.setAppliedTheme(theme);
  };

  /**
   * 更新主題
   */
  const updateTheme = (): void => {
    const theme = themeStore.currentTheme;
    let appliedTheme: AppliedTheme;

    if (theme === 'system') {
      appliedTheme = getSystemTheme();
    } else {
      appliedTheme = theme;
    }

    applyTheme(appliedTheme);
  };

  /**
   * 系統主題變化監聽器
   */
  const handleSystemThemeChange = (e: MediaQueryListEvent): void => {
    if (themeStore.currentTheme === 'system') {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  };

  /**
   * 設定主題
   */
  const setTheme = (theme: ThemeMode): void => {
    themeStore.setTheme(theme);
    updateTheme();
  };

  /**
   * 初始化主題
   */
  const initTheme = (): void => {
    // 監聽系統主題變化
    if (typeof window !== 'undefined') {
      mediaQuery = window.matchMedia(FA_MEDIA_QUERY_DARK);
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    }

    // 應用初始主題
    updateTheme();
  };

  /**
   * 清理監聽器
   */
  const cleanup = (): void => {
    if (mediaQuery) {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }
  };

  // 生命週期
  onMounted(() => {
    initTheme();
  });

  onBeforeUnmount(() => {
    cleanup();
  });

  // 監聽 store 中的主題變化
  watch(
    () => themeStore.currentTheme,
    () => {
      updateTheme();
    }
  );

  return {
    // 狀態
    theme: computed(() => themeStore.currentTheme),
    appliedTheme: computed(() => themeStore.appliedTheme),
    isDark: computed(() => themeStore.isDark),
    isLight: computed(() => themeStore.isLight),
    isSystem: computed(() => themeStore.isSystem),
    // 方法
    setTheme,
    initTheme,
  };
}
