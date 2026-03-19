<template>
  <BaseModal
    v-model="isOpen"
    :title="title"
    size="sm"
    confirm-text="確認刪除"
    cancel-text="取消"
    @confirm="handleConfirm"
  >
    <div class="modal-content">
      <div class="warning-icon-container">
        <svg class="warning-icon-large" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <div class="message-container">
        <p class="message-title">{{ message }}</p>
        <p v-if="detail" class="message-detail">{{ detail }}</p>
      </div>

      <div class="warning-box">
        <p class="warning-text">⚠️ 此操作無法復原，請確認後再執行。</p>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import BaseModal from '@/components/base/BaseModal.vue';

interface Props {
  modelValue: boolean;
  title?: string;
  message: string;
  detail?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: '確認刪除',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm'): void;
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const handleConfirm = () => {
  emit('confirm');
  emit('update:modelValue', false);
};
</script>

<style scoped>
.modal-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  text-align: center;
}

.warning-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  background: rgb(239 68 68 / 10%);
  border-radius: 50%;
}

.warning-icon-large {
  width: 2.5rem;
  height: 2.5rem;
  color: var(--error);
}

.message-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.message-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.message-detail {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.warning-box {
  width: 100%;
  padding: 0.75rem;
  background: rgb(239 68 68 / 10%);
  border: 1px solid rgb(239 68 68 / 30%);
  border-radius: 0.5rem;
}

.warning-text {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-primary);
}
</style>
