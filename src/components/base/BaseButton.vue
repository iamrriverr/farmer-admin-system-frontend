<script setup lang="ts">
/**
 * 通用按鈕組件
 * 支援多種樣式變體、尺寸、載入狀態與禁用狀態
 */

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  fullWidth: false,
  type: 'button',
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};
</script>

<template>
  <button
    :type="type"
    :class="[
      'base-button',
      `variant-${variant}`,
      `size-${size}`,
      { 'full-width': fullWidth, disabled: disabled || loading, loading },
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="loading-spinner"></span>
    <span :class="{ 'button-content': true, 'with-spinner': loading }">
      <slot></slot>
    </span>
  </button>
</template>

<style scoped>
.base-button {
  position: relative;
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  outline: none;
  border: none;
  border-radius: 0.5rem;
  /* 移除預設過渡，防止主題切換黑閃 */
}

/* 尺寸變體 */
.size-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.size-md {
  padding: 0.75rem 1.5rem;
  font-size: 0.9375rem;
}

.size-lg {
  padding: 1rem 2rem;
  font-size: 1rem;
}

/* 樣式變體 */
.variant-primary {
  color: white;
  background: var(--primary);
}

.variant-primary:hover:not(.disabled) {
  background: var(--primary-hover);
  transition: background-color 0.2s ease;
}

.variant-primary:active:not(.disabled) {
  background: var(--primary-hover);
}

.variant-secondary {
  color: var(--text-primary);
  background: var(--bg-secondary);
}

.variant-secondary:hover:not(.disabled) {
  background: var(--bg-tertiary);
  transition: background-color 0.2s ease;
}

.variant-outline {
  color: var(--primary);
  background: transparent;
  border: 1px solid var(--primary);
}

.variant-outline:hover:not(.disabled) {
  background: rgb(0 173 104 / 10%);
  transition: background-color 0.2s ease;
}

.variant-ghost {
  color: var(--text-primary);
  background: transparent;
}

.variant-ghost:hover:not(.disabled) {
  background: var(--bg-secondary);
  transition: background-color 0.2s ease;
}

.variant-danger {
  color: white;
  background: var(--error);
}

.variant-danger:hover:not(.disabled) {
  background: var(--error-hover);
  transition: background-color 0.2s ease;
}

/* 狀態 */
.full-width {
  width: 100%;
}

.disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.loading {
  cursor: wait;
}

.button-content.with-spinner {
  opacity: 0;
}

/* 載入動畫 */
.loading-spinner {
  position: absolute;
  width: 1rem;
  height: 1rem;
  border: 2px solid currentcolor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
