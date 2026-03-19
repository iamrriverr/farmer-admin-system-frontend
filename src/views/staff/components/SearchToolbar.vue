<template>
  <div class="toolbar">
    <div class="search-box">
      <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="ICONS.SEARCH" />
      </svg>
      <input :value="searchQuery" type="text" placeholder="搜尋帳號或姓名" class="search-input"
        @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)" />
    </div>

    <div v-if="showFilters" class="filters">
      <!-- 部門：動態從 DepartmentStore 取得，不寫死 -->
      <select :value="filterDepartment" class="filter-select"
        @change="$emit('update:filterDepartment', ($event.target as HTMLSelectElement).value)">
        <option value="">全部部門</option>
        <option v-for="dept in activeDepartments" :key="dept.id" :value="dept.name">
          {{ dept.name }}
        </option>
      </select>

      <select :value="filterRole" class="filter-select"
        @change="$emit('update:filterRole', ($event.target as HTMLSelectElement).value)">
        <option value="">全部權限</option>
        <option value="admin">系統管理員</option>
        <option value="manager">部門主管</option>
        <option value="user">一般員工</option>
      </select>

      <select :value="filterStatus" class="filter-select"
        @change="$emit('update:filterStatus', ($event.target as HTMLSelectElement).value)">
        <option value="">全部狀態</option>
        <option value="true">啟用</option>
        <option value="false">停用</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ICONS } from '@/constants/icons';
import { useDepartmentStore } from '@/stores/department';

interface Props {
  searchQuery: string;
  filterDepartment: string;
  filterRole: string;
  filterStatus: string;
  showFilters?: boolean;
}

withDefaults(defineProps<Props>(), {
  showFilters: false,
});

defineEmits<{
  (e: 'update:searchQuery', value: string): void;
  (e: 'update:filterDepartment', value: string): void;
  (e: 'update:filterRole', value: string): void;
  (e: 'update:filterStatus', value: string): void;
}>();

const departmentStore = useDepartmentStore();

// 只列出啟用中的部門（後端整合後替換為 API 請求）
const activeDepartments = computed(() =>
  departmentStore.departments.filter((d) => d.active)
);
</script>

<style scoped>
.toolbar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 1rem;
  width: 1.25rem;
  height: 1.25rem;
  color: var(--text-tertiary);
  pointer-events: none;
  transform: translateY(-50%);
}

.search-input {
  width: 100%;
  padding: 0.625rem 1rem 0.625rem 3rem;
  font-size: 0.875rem;
  color: var(--text-primary);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 0.5rem;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
  transition: border-color 0.2s ease;
}

.filters {
  display: flex;
  gap: 0.75rem;
}

.filter-select {
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  color: var(--text-primary);
  cursor: pointer;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 0.5rem;
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary);
  transition: border-color 0.2s ease;
}
</style>
