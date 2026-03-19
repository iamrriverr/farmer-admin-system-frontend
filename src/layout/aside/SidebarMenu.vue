<script setup lang="ts">
import { ref } from 'vue';

import type { MenuItem } from '@/types';

interface Props {
  item: MenuItem;
  isActive?: boolean;
  isNewChat?: boolean;
  suppressTooltip?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
  isNewChat: false,
  suppressTooltip: false,
});

interface Emits {
  (e: 'click', item: MenuItem): void;
}

const emit = defineEmits<Emits>();

const buttonRef = ref<HTMLButtonElement | null>(null);
const showTooltip = ref(false);
const tooltipStyle = ref({});
let tooltipTimer: number | null = null;

const handleClick = (): void => {
  // 點擊後立刻隱藏 Tooltip
  clearTooltipTimer();
  showTooltip.value = false;
  emit('click', props.item);
};

const clearTooltipTimer = () => {
  if (tooltipTimer) {
    clearTimeout(tooltipTimer);
    tooltipTimer = null;
  }
};

const handleMouseEnter = (): void => {
  if (props.suppressTooltip) return;

  clearTooltipTimer();
  // 設置延遲，避免滑鼠滑過時頻繁閃動
  tooltipTimer = window.setTimeout(() => {
    if (buttonRef.value) {
      const rect = buttonRef.value.getBoundingClientRect();
      tooltipStyle.value = {
        top: `${rect.top + rect.height / 2}px`,
        left: `${rect.right + 12}px`,
        transform: 'translateY(-50%)',
      };
      showTooltip.value = true;
    }
  }, 500); // 500ms 延遲
};

const handleMouseLeave = (): void => {
  clearTooltipTimer();
  showTooltip.value = false;
};
</script>

<template>
  <div>
    <button
      ref="buttonRef"
      class="menu-button"
      :class="{
        active: isActive && !isNewChat,
        'new-chat-button': isNewChat,
      }"
      @click="handleClick"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <svg
        class="menu-icon"
        :class="{ 'new-chat-icon': isNewChat }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
      </svg>
    </button>

    <Teleport to="body">
      <Transition name="tooltip">
        <div v-if="showTooltip" class="menu-tooltip" :style="tooltipStyle">
          {{ item.label }}
          <div class="tooltip-arrow"></div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.menu-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  background-color: transparent;
  border: none;
  border-radius: 2rem;
}

.menu-button:hover {
  color: var(--primary);
  background-color: var(--bg-tertiary);
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.menu-button.active {
  color: white;
  background-color: var(--primary);
}

.menu-button.active:hover {
  background-color: var(--primary-hover);
}

.menu-icon {
  width: 1.5rem;
  height: 1.5rem;

  /* 修正：僅針對尺寸過渡 */
  transition:
    width 0.2s ease,
    height 0.2s ease;
}

/* 新對話按鈕獨立樣式 */
.new-chat-button {
  color: var(--text-secondary);
  background-color: transparent;
}

.new-chat-button:hover {
  color: var(--primary);
  background-color: var(--bg-tertiary);
}

.new-chat-button:active {
  background-color: var(--bg-tertiary);
}

.new-chat-button:active .new-chat-icon {
  width: 1.35rem;
  height: 1.35rem;
}

/* Tooltip */
.menu-tooltip {
  position: fixed;
  z-index: 9999;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: var(--text-primary);
  white-space: nowrap;
  pointer-events: none;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: 0.375rem;
}

.dark .menu-tooltip {
  color: var(--text-primary);
  background-color: var(--bg-tertiary);
  border-color: var(--border-primary);
}

.tooltip-arrow {
  position: absolute;
  top: 50%;
  right: 100%;
  width: 0;
  height: 0;
  border-color: transparent var(--bg-primary) transparent transparent;
  border-style: solid;
  border-width: 5px 6px 5px 0;
  transform: translateY(-50%);
}

.dark .tooltip-arrow {
  border-color: transparent var(--bg-tertiary) transparent transparent;
}

.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity 0.15s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
}
</style>
