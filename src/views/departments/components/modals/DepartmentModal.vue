<template>
  <BaseModal v-model="isOpen" :title="isEdit ? '編輯部門' : '新增部門'" size="md" :confirm-disabled="!isFormValid"
    @confirm="handleSubmit" @close="handleClose">
    <form class="form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label class="form-label required">部門代碼</label>
        <input v-model="formData.code" type="text" class="form-input" placeholder="例如：CR01" :disabled="isEdit"
          required />
        <p v-if="isEdit" class="form-hint">ⓘ 部門代碼作為唯一識別碼，建立後無法修改</p>
      </div>

      <div class="form-group">
        <label class="form-label required">部門名稱</label>
        <input v-model="formData.name" type="text" class="form-input" placeholder="例如：信用部" required />
      </div>

      <div class="form-group">
        <label class="form-label">部門主管（選填）</label>
        <select v-model="formData.managerName" class="form-select">
          <option value="">暫不指派</option>
          <option v-for="manager in availableManagers" :key="manager.id" :value="manager.name">
            {{ manager.name }}
          </option>
        </select>
        <p class="form-hint">💡 可先建立部門，稍後再從人員管理指派主管</p>
      </div>

      <div class="form-group">
        <label class="form-checkbox">
          <input v-model="formData.active" type="checkbox" />
          <span>啟用</span>
        </label>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import BaseModal from '@/components/base/BaseModal.vue';
import { useStaffStore } from '@/stores/staff';
import type { Department, DepartmentFormData } from '@/types/department';

interface Props {
  modelValue: boolean;
  department?: Department | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'submit', data: DepartmentFormData): void;
}>();

const staffStore = useStaffStore();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const isEdit = computed(() => !!props.department);

// 從 Store 獲取可用主管列表（主管和管理員）
const availableManagers = computed(() => staffStore.managers);

const defaultFormData: DepartmentFormData = {
  code: '',
  name: '',
  managerName: '',
  active: true,
};

const formData = ref<DepartmentFormData>({ ...defaultFormData });

const isFormValid = computed(() => {
  return formData.value.code.trim() !== '' && formData.value.name.trim() !== '';
});

// 監聽 department 變化，填充表單
watch(
  () => props.department,
  (dept) => {
    if (dept) {
      formData.value = {
        code: dept.code,
        name: dept.name,
        managerName: dept.managerName || '',
        active: dept.active,
      };
    } else {
      formData.value = { ...defaultFormData };
    }
  },
  { immediate: true }
);

const handleSubmit = () => {
  if (!isFormValid.value) return;
  emit('submit', { ...formData.value });
  handleClose();
};

const handleClose = () => {
  formData.value = { ...defaultFormData };
};
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

.form-input,
.form-select {
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  color: var(--text-primary);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 0.5rem;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--primary);
}

.form-input:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.form-select {
  cursor: pointer;
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

.form-hint {
  margin: 0;
  font-size: 0.75rem;
  color: var(--text-secondary);
}
</style>
