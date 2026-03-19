<script setup lang="ts">
import { type IconName, ICONS } from '@/constants/icons';

interface Props {
  icon?: IconName;
  label?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  type: 'button',
  disabled: false,
});

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const handleClick = (event: MouseEvent) => {
  emit('click', event);
};
</script>

<template>
  <button :type="type" class="icon-btn" :disabled="disabled" @click="handleClick">
    <slot name="icon">
      <svg v-if="icon" class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="ICONS[icon]" />
      </svg>
    </slot>
    <span v-if="label" class="btn-text">{{ label }}</span>
    <slot></slot>
  </button>
</template>

<style scoped>
.icon-btn {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.icon-btn:hover:not(:disabled) {
  transition:
    background-color 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease;
}

.icon-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.btn-icon {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
}

.btn-text {
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
