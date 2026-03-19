<template>
  <div class="table-container">
    <table class="data-table">
      <thead>
        <tr>
          <th>部門代碼</th>
          <th>部門名稱</th>
          <th>部門主管</th>
          <th>員工數量</th>
          <th>知識庫文件</th>
          <th>狀態</th>
          <th>建立時間</th>
          <th class="col-actions">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="dept in departments" :key="dept.id">
          <td>{{ dept.code }}</td>
          <td>{{ dept.name }}</td>
          <td>{{ dept.managerName || '-' }}</td>
          <td>{{ dept.memberCount }}</td>
          <td>{{ dept.knowledgeBaseCount || 0 }}</td>
          <td>
            <span :class="['status-badge', dept.active ? 'active' : 'inactive']">
              {{ dept.active ? '啟用' : '停用' }}
            </span>
          </td>
          <td>{{ dept.createdAt }}</td>
          <td class="col-actions">
            <div class="action-buttons">
              <button v-if="isAdmin" class="btn-icon" title="編輯" @click="$emit('edit', dept)">
                <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="ICONS.EDIT" />
                </svg>
              </button>
              <button v-if="isAdmin" class="btn-icon btn-danger" title="刪除" @click="$emit('delete', dept)">
                <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="ICONS.DELETE" />
                </svg>
              </button>
              <button v-if="!isAdmin" class="btn-icon" title="查看詳情" @click="$emit('view', dept)">
                <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ICONS } from '@/constants/icons';
import type { Department } from '@/types/department';

interface Props {
  departments: Department[];
  isAdmin: boolean;
}

defineProps<Props>();

defineEmits<{
  (e: 'edit', dept: Department): void;
  (e: 'delete', dept: Department): void;
  (e: 'view', dept: Department): void;
}>();
</script>

<style scoped>
.table-container {
  margin-bottom: 1.5rem;
  overflow: hidden;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 0.75rem;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead th {
  padding: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-align: left;
  background: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-primary);
}

.data-table tbody tr {
  border-bottom: 1px solid var(--border-secondary);
}

.data-table tbody tr:hover {
  background: var(--bg-tertiary);
}

.data-table tbody td {
  padding: 1rem;
  font-size: 0.875rem;
  color: var(--text-primary);
}

.col-actions {
  position: sticky;
  right: 0;
  width: 150px;
  background: var(--bg-secondary);
}

.data-table thead th.col-actions {
  background: var(--bg-tertiary);
}

.data-table tbody tr:hover .col-actions {
  background: var(--bg-tertiary);
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.btn-icon {
  padding: 0.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.btn-icon:hover {
  color: var(--primary);
  background: var(--bg-primary);
}

.btn-icon.btn-danger:hover {
  color: var(--error);
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.status-badge {
  display: inline-flex;
  gap: 0.375rem;
  align-items: center;
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;
}

.status-badge.active {
  color: var(--success);
  background: rgb(16 185 129 / 10%);
}

.status-badge.inactive {
  color: var(--error);
  background: rgb(239 68 68 / 10%);
}
</style>
