<template>
  <BaseModal
    v-model="isOpen"
    title="調整帳號權限"
    size="sm"
    confirm-text="確認調整"
    @confirm="handleSubmit"
    @close="handleClose"
  >
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
        <div class="info-row">
          <span class="info-label">目前權限：</span>
          <span class="info-value">{{ currentRoleLabel }}</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label required">新權限</label>
        <select v-model="newRole" class="form-select" required>
          <option value="">請選擇權限</option>
          <option value="admin">系統管理員</option>
          <option value="manager">部門主管</option>
          <option value="user">一般員工</option>
        </select>
      </div>

      <div class="warning-box">
        <svg class="warning-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p class="warning-text">警告：調整權限後，使用者將獲得對應的系統權限，請謹慎操作。</p>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import BaseModal from '@/components/base/BaseModal.vue';
import type { UserInfo, UserRole } from '@/types/user';
import { ROLE_LABELS } from '@/types/user';

interface Props {
  modelValue: boolean;
  user?: UserInfo | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'submit', userId: string, newRole: UserRole): void;
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const newRole = ref<UserRole | ''>('');

const currentRoleLabel = computed(() => {
  return props.user ? ROLE_LABELS[props.user.role] : '-';
});

// 監聽 user 變化，重置表單
watch(
  () => props.user,
  () => {
    newRole.value = '';
  },
  { immediate: true }
);

const handleSubmit = () => {
  if (!props.user || !newRole.value) return;
  emit('submit', props.user.id, newRole.value);
  handleClose();
};

const handleClose = () => {
  newRole.value = '';
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

.form-label.required::after {
  color: var(--error);
  content: ' *';
}

.form-select {
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  color: var(--text-primary);
  cursor: pointer;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 0.5rem;
  transition: border-color 0.2s;
}

.form-select:focus {
  outline: none;
  border-color: var(--primary);
}

.warning-box {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: rgb(245 158 11 / 10%);
  border: 1px solid rgb(245 158 11 / 30%);
  border-radius: 0.5rem;
}

.warning-icon {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  color: var(--warning);
}

.warning-text {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-primary);
}
</style>
