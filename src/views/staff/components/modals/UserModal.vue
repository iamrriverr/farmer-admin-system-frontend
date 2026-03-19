<template>
  <BaseModal v-model="isOpen" :title="isEdit ? '編輯使用者' : '新增使用者'" size="md" :confirm-disabled="!isFormValid"
    @confirm="handleSubmit" @close="handleClose">
    <form class="form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label class="form-label required">帳號</label>
        <input v-model="formData.username" type="text" class="form-input" placeholder="例如：user001" :disabled="isEdit"
          required />
        <p v-if="isEdit" class="form-hint">ⓘ 帳號作為登入憑證，建立後無法修改</p>
      </div>

      <div class="form-group">
        <label class="form-label">姓名</label>
        <input v-model="formData.name" type="text" class="form-input" placeholder="請輸入姓名" />
      </div>

      <div class="form-group">
        <label class="form-label required">帳號權限</label>
        <select v-model="formData.role" class="form-select" :disabled="!canEditRole" required>
          <option value="">請選擇權限</option>
          <option value="admin">系統管理員</option>
          <option value="manager">部門主管</option>
          <option value="user">一般員工</option>
        </select>
        <p v-if="!canEditRole" class="form-hint">ⓘ 部門主管無法調整使用者權限</p>
      </div>

      <div class="form-group">
        <label class="form-label">部門（選填）</label>
        <select v-model="formData.department" class="form-select">
          <option value="">暫不分配</option>
          <option v-for="dept in availableDepartments" :key="dept.id" :value="dept.name">
            {{ dept.name }}
          </option>
        </select>
        <p class="form-hint">💡 可先建立使用者，稍後再從部門管理分配部門</p>
      </div>

      <div v-if="!isEdit" class="form-group">
        <label class="form-label">預設密碼</label>
        <input v-model="formData.password" type="text" class="form-input" placeholder="系統將自動產生預設密碼" disabled />
      </div>

      <div v-if="!isEdit" class="form-group">
        <label class="form-checkbox">
          <input v-model="formData.mustChangePassword" type="checkbox" />
          <span>首次登入強制修改密碼</span>
        </label>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import BaseModal from '@/components/base/BaseModal.vue';
import { usePermission } from '@/composables/usePermission';
import { useDepartmentStore } from '@/stores/department';
import type { UserInfo, UserRole } from '@/types/user';

interface UserFormData {
  username: string;
  name?: string;
  role: UserRole | '';
  department: string;
  password?: string;
  mustChangePassword?: boolean;
}

interface Props {
  modelValue: boolean;
  user?: UserInfo | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'submit', data: UserFormData): void;
}>();

const { isAdmin } = usePermission();
const departmentStore = useDepartmentStore();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const isEdit = computed(() => !!props.user);

// 部門主管無法調整權限
const canEditRole = computed(() => isAdmin.value);

// 從 Store 獲取可用部門列表
const availableDepartments = computed(() => departmentStore.departments);

const defaultFormData: UserFormData = {
  username: '',
  name: '',
  role: '',
  department: '',
  password: '', // TODO: 後端整合後改由後端產生並回傳
  mustChangePassword: true,
};

const formData = ref<UserFormData>({ ...defaultFormData });

const isFormValid = computed(() => {
  return (
    formData.value.username.trim() !== '' &&
    formData.value.role !== ''
    // 部門改為選填，不再驗證
  );
});

// 監聽 user 變化，填充表單
watch(
  () => props.user,
  (user) => {
    if (user) {
      formData.value = {
        username: user.username,
        name: user.name || '',
        role: user.role,
        department: user.department || '',
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

.form-input:disabled,
.form-select:disabled {
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
