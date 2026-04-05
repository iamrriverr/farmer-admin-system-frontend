<template>
  <div class="departments-page">
    <PageHeader title="部門管理">
      <template #action>
        <IconBtn
          v-if="isAdmin"
          icon="PLUS"
          label="新增部門"
          class="btn-primary"
          @click="handleAdd"
        />
      </template>
    </PageHeader>

    <DepartmentTable
      :departments="paginatedDepartments"
      :is-admin="isAdmin"
      @edit="handleEdit"
      @delete="handleDelete"
      @view="handleView"
    />

    <Pagination
      :current-page="currentPage"
      :total-pages="totalPages"
      :total="total"
      :start-index="startIndex"
      :end-index="endIndex"
      @page-change="goToPage"
    />

    <!-- 部門 Modal -->
    <DepartmentModal
      v-model="showDepartmentModal"
      :department="selectedDepartment"
      @submit="handleDepartmentSubmit"
    />

    <!-- 刪除確認 Modal -->
    <BaseModal
      v-model="showDeleteModal"
      title="確認刪除"
      size="sm"
      confirm-text="確認刪除"
      @confirm="handleConfirmDelete"
    >
      <div class="delete-confirm-content">
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
          <p class="message-title">確定要刪除「{{ selectedDepartment?.name }}」嗎？</p>
          <p class="message-detail">刪除後將無法恢復此部門資料</p>
        </div>

        <div class="warning-box">
          <p class="warning-text">⚠️ 此操作無法復原，請確認後再執行。</p>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import BaseModal from '@/components/base/BaseModal.vue';
import IconBtn from '@/components/base/IconBtn.vue';
import PageHeader from '@/components/common/PageHeader.vue';
import Pagination from '@/components/common/Pagination.vue';
import { usePermission } from '@/composables/usePermission';
import { useDepartmentStore } from '@/stores/department';
import type { Department, DepartmentFormData } from '@/types/department';

import DepartmentTable from './components/DepartmentTable.vue';
import DepartmentModal from './components/modals/DepartmentModal.vue';

const { isAdmin } = usePermission();
const departmentStore = useDepartmentStore();

onMounted(() => {
  departmentStore.fetchDepartments();
});

// Modal 狀態
const showDepartmentModal = ref(false);
const showDeleteModal = ref(false);
const selectedDepartment = ref<Department | null>(null);

// 分頁相關
const currentPage = ref(1);
const pageSize = 10;

const total = computed(() => departmentStore.departments.length);
const totalPages = computed(() => Math.ceil(total.value / pageSize));

const paginatedDepartments = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return departmentStore.departments.slice(start, end);
});

const startIndex = computed(() => (currentPage.value - 1) * pageSize + 1);
const endIndex = computed(() => Math.min(currentPage.value * pageSize, total.value));

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// CRUD 操作
const handleAdd = () => {
  selectedDepartment.value = null;
  showDepartmentModal.value = true;
};

const handleEdit = (dept: Department) => {
  selectedDepartment.value = dept;
  showDepartmentModal.value = true;
};

const handleDelete = (dept: Department) => {
  selectedDepartment.value = dept;
  showDeleteModal.value = true;
};

const handleView = (dept: Department) => {
  console.log('查看詳情', dept);
  // TODO: 實作查看詳情功能
};

const handleDepartmentSubmit = (formData: DepartmentFormData) => {
  if (selectedDepartment.value) {
    // 編輯
    const updated = departmentStore.updateDepartment(selectedDepartment.value.id, formData);
    if (updated) {
      console.log('✅ 部門已更新:', updated);
    }
  } else {
    // 新增
    const newDepartment = departmentStore.addDepartment(formData);
    console.log('✅ 部門已新增:', newDepartment);
  }
  showDepartmentModal.value = false;
};

const handleConfirmDelete = () => {
  if (selectedDepartment.value) {
    const deleted = departmentStore.deleteDepartment(selectedDepartment.value.id);
    if (deleted) {
      console.log('✅ 部門已刪除:', deleted.name);
    }
  }
  showDeleteModal.value = false;
  selectedDepartment.value = null;
};
</script>

<style scoped>
.departments-page {
  max-width: 1400px;
  padding: 2rem;
  margin: 0 auto;
}

.btn-primary {
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  cursor: pointer;
  background: var(--primary);
  border: none;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background: var(--primary-hover);
}

/* 刪除確認 Modal 樣式 */
.delete-confirm-content {
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
