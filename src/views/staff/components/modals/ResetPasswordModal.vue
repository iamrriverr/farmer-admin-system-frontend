<template>
  <BaseModal v-model="isOpen" title="重置密碼" size="sm" confirm-text="確認重置" @confirm="handleSubmit" @close="handleClose">
    <div class="modal-content">
      <div class="user-info">
        <div class="info-row">
          <span class="info-label">帳號：</span>
          <span class="info-value">{{ user?.username }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">姓名：</span>
          <span class="info-value">{{ user?.name || '-' }}</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">新密碼</label>
        <input v-model="newPassword" type="text" class="form-input" :placeholder="`預設：${DEFAULT_PASSWORD}`" />
      </div>

      <div class="form-group">
        <label class="form-checkbox">
          <input v-model="mustChangePassword" type="checkbox" />
          <span>強制下次登入修改密碼</span>
        </label>
      </div>

      <div class="info-box">
        <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="info-text">提示：重置後請通知使用者新密碼</p>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import BaseModal from '@/components/base/BaseModal.vue';
import { DEFAULT_PASSWORD } from '@/mock/staff';
import type { UserInfo } from '@/types/user';

interface Props {
  modelValue: boolean;
  user?: UserInfo | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'submit', userId: string, password: string, mustChange: boolean): void;
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const newPassword = ref(DEFAULT_PASSWORD);
const mustChangePassword = ref(true);

// 監聽 user 變化，重置表單
watch(
  () => props.user,
  () => {
    newPassword.value = DEFAULT_PASSWORD;
    mustChangePassword.value = true;
  },
  { immediate: true }
);

const handleSubmit = () => {
  if (!props.user) return;
  emit('submit', props.user.id, newPassword.value, mustChangePassword.value);
  handleClose();
};

const handleClose = () => {
  newPassword.value = DEFAULT_PASSWORD;
  mustChangePassword.value = true;
};
</script>

<style scoped>
.modal-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.user-info {
  padding: 1rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 0.5rem;
}

.info-row {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 0;
  font-size: 0.875rem;
}

.info-row:not(:last-child) {
  border-bottom: 1px solid var(--border-secondary);
}

.info-label {
  min-width: 80px;
  color: var(--text-secondary);
}

.info-value {
  font-weight: 500;
  color: var(--text-primary);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.form-input {
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  color: var(--text-primary);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 0.5rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
}

.form-checkbox {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.875rem;
  color: var(--text-primary);
  cursor: pointer;
}

.form-checkbox input[type='checkbox'] {
  width: 1.125rem;
  height: 1.125rem;
  cursor: pointer;
}

.info-box {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: rgb(59 130 246 / 10%);
  border: 1px solid rgb(59 130 246 / 30%);
  border-radius: 0.5rem;
}

.info-icon {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  color: var(--info);
}

.info-text {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-primary);
}
</style>
