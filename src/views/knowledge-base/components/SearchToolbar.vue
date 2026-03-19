<template>
  <div class="search-toolbar">
    <!-- 搜尋框 -->
    <div class="search-input-wrapper">
      <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
      </svg>
      <input
        :value="searchQuery"
        class="search-input"
        type="text"
        placeholder="搜尋文件標題、標籤..."
        @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <!-- 篩選列 -->
    <div class="filters">
      <!-- 分類篩選 -->
      <select
        :value="filterCategory"
        class="filter-select"
        @change="$emit('update:filterCategory', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">全部分類</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>

      <!-- 部門篩選（僅管理員可見） -->
      <select
        v-if="isAdmin"
        :value="filterDepartment"
        class="filter-select"
        @change="$emit('update:filterDepartment', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">全部部門</option>
        <option value="__public__">公開（無部門限制）</option>
        <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
      </select>

      <!-- 狀態篩選 -->
      <select
        :value="filterStatus"
        class="filter-select"
        @change="$emit('update:filterStatus', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">全部狀態</option>
        <option value="ready">已就緒</option>
        <option value="processing">處理中</option>
        <option value="error">錯誤</option>
      </select>

      <!-- 清除篩選 -->
      <button v-if="hasActiveFilter" class="btn-clear" @click="clearFilters">
        <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        清除篩選
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  searchQuery: string;
  filterCategory: string;
  filterDepartment: string;
  filterStatus: string;
  categories: string[];
  departments: string[];
  isAdmin: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:searchQuery', value: string): void;
  (e: 'update:filterCategory', value: string): void;
  (e: 'update:filterDepartment', value: string): void;
  (e: 'update:filterStatus', value: string): void;
  (e: 'clear'): void;
}>();

const hasActiveFilter = computed(
  () => props.searchQuery || props.filterCategory || props.filterDepartment || props.filterStatus
);

const clearFilters = () => {
  emit('update:searchQuery', '');
  emit('update:filterCategory', '');
  emit('update:filterDepartment', '');
  emit('update:filterStatus', '');
  emit('clear');
};
</script>

<style scoped>
.search-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  padding: 1rem 1.25rem;
  margin-bottom: 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 0.75rem;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 0.75rem;
  width: 1rem;
  height: 1rem;
  color: var(--text-secondary);
  transform: translateY(-50%);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.5rem 0.75rem 0.5rem 2.25rem;
  font-size: 0.875rem;
  color: var(--text-primary);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 0.5rem;
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
  transition: border-color 0.2s ease;
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.filter-select {
  padding: 0.5rem 0.75rem;
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

.btn-clear {
  display: flex;
  gap: 0.375rem;
  align-items: center;
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  cursor: pointer;
  background: transparent;
  border: 1px solid var(--border-primary);
  border-radius: 0.5rem;
}

.btn-clear:hover {
  color: var(--error);
  border-color: var(--error);
  transition: color 0.2s ease, border-color 0.2s ease;
}

.icon-sm {
  width: 0.875rem;
  height: 0.875rem;
}
</style>
