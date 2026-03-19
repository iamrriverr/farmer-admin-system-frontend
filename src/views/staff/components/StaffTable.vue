<template>
  <div class="table-container">
    <table class="data-table">
      <thead>
        <tr>
          <th @click="$emit('sort', 'username')" class="sortable">
            帳號
            <span class="sort-icon">{{ getSortIcon('username') }}</span>
          </th>
          <th @click="$emit('sort', 'name')" class="sortable">
            姓名
            <span class="sort-icon">{{ getSortIcon('name') }}</span>
          </th>
          <th>帳號權限</th>
          <th>部門</th>
          <th @click="$emit('sort', 'active')" class="sortable">
            帳號狀態
            <span class="sort-icon">{{ getSortIcon('active') }}</span>
          </th>
          <th @click="$emit('sort', 'createdAt')" class="sortable">
            建立時間
            <span class="sort-icon">{{ getSortIcon('createdAt') }}</span>
          </th>
          <th @click="$emit('sort', 'lastLoginAt')" class="sortable">
            最後登入
            <span class="sort-icon">{{ getSortIcon('lastLoginAt') }}</span>
          </th>
          <th class="col-actions">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.username }}</td>
          <td>{{ user.name || '-' }}</td>
          <td>{{ ROLE_LABELS[user.role] }}</td>
          <td>{{ user.department || '-' }}</td>
          <td>
            <span :class="['status-badge', user.active ? 'active' : 'inactive']">
              {{ user.active ? '啟用' : '停用' }}
            </span>
          </td>
          <td>{{ user.createdAt }}</td>
          <td>{{ user.lastLoginAt || '從未登入' }}</td>
          <td class="col-actions">
            <div class="action-buttons">
              <button v-if="canEdit(user)" class="btn-icon" title="編輯" @click="$emit('edit', user)">
                <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="ICONS.EDIT" />
                </svg>
              </button>
              <button v-if="isAdmin" class="btn-icon" title="調整權限" @click="$emit('change-role', user)">
                <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="ICONS.SHIELD_CHECK" />
                </svg>
              </button>
              <button v-if="canResetPassword(user)" class="btn-icon" title="重置密碼"
                @click="$emit('reset-password', user)">
                <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="ICONS.KEY" />
                </svg>
              </button>
              <button v-if="isAdmin" class="btn-icon btn-danger" title="刪除" @click="$emit('delete', user)">
                <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="ICONS.DELETE" />
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
import type { UserInfo } from '@/types/user';
import { ROLE_LABELS } from '@/types/user';

interface Props {
  users: UserInfo[];
  isAdmin: boolean;
  isManager: boolean;
  currentUserDepartment?: string;
  sortField: string;
  sortOrder: 'asc' | 'desc';
}

const props = defineProps<Props>();

defineEmits<{
  (e: 'edit', user: UserInfo): void;
  (e: 'change-role', user: UserInfo): void;
  (e: 'reset-password', user: UserInfo): void;
  (e: 'delete', user: UserInfo): void;
  (e: 'sort', field: string): void;
}>();

const getSortIcon = (field: string) => {
  if (props.sortField !== field) return '⇅';
  return props.sortOrder === 'asc' ? '↑' : '↓';
};

const canEdit = (user: UserInfo) => {
  if (props.isAdmin) return true;
  if (props.isManager) {
    return user.department === props.currentUserDepartment;
  }
  return false;
};

const canResetPassword = (user: UserInfo) => {
  return canEdit(user);
};
</script>

<style scoped>
.table-container {
  margin-bottom: 1.5rem;
  overflow-x: auto;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 0.75rem;
}

.data-table {
  width: 100%;
  min-width: 1000px;
  border-collapse: collapse;
}

.data-table thead th {
  padding: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-align: left;
  white-space: nowrap;
  background: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-primary);
}

.data-table thead th.sortable {
  cursor: pointer;
  user-select: none;
  transition: color 0.2s;
}

.data-table thead th.sortable:hover {
  color: var(--primary);
}

.sort-icon {
  margin-left: 0.25rem;
  font-size: 0.75rem;
  opacity: 0.5;
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
  width: 200px;
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
