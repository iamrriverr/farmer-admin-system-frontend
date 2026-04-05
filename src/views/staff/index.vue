<template>
  <div class="staff-page">
    <PageHeader title="人員管理">
      <template #action>
        <IconBtn
          v-if="canManageStaff"
          icon="PLUS"
          label="新增使用者"
          class="btn-primary"
          @click="handleAdd"
        />
      </template>
    </PageHeader>

    <SearchToolbar
      v-model:search-query="searchQuery"
      v-model:filter-department="filterDepartment"
      v-model:filter-role="filterRole"
      v-model:filter-status="filterStatus"
      :show-filters="isAdmin"
    />

    <StaffTable
      :users="paginatedUsers"
      :is-admin="isAdmin"
      :is-manager="isManager"
      :current-user-department="userStore.user?.department"
      :sort-field="sortField"
      :sort-order="sortOrder"
      @edit="handleEdit"
      @change-role="handleChangeRole"
      @reset-password="handleResetPassword"
      @delete="handleDelete"
      @sort="handleSort"
    />

    <Pagination
      :current-page="currentPage"
      :total-pages="totalPages"
      :total="total"
      :start-index="startIndex"
      :end-index="endIndex"
      @page-change="goToPage"
    />

    <!-- 使用者 Modal -->
    <UserModal v-model="showUserModal" :user="selectedUser" @submit="handleUserSubmit" />

    <!-- 調整權限 Modal -->
    <ChangeRoleModal
      v-model="showChangeRoleModal"
      :user="selectedUser"
      @submit="handleRoleSubmit"
    />

    <!-- 重置密碼 Modal -->
    <ResetPasswordModal
      v-model="showResetPasswordModal"
      :user="selectedUser"
      @submit="handlePasswordSubmit"
    />

    <!-- 刪除確認 Modal -->
    <ConfirmDeleteModal
      v-model="showDeleteModal"
      :message="`確定要刪除使用者「${selectedUser?.name || selectedUser?.username}」嗎？`"
      detail="刪除後將無法恢復此使用者資料"
      @confirm="handleConfirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import IconBtn from '@/components/base/IconBtn.vue';
import PageHeader from '@/components/common/PageHeader.vue';
import Pagination from '@/components/common/Pagination.vue';
import { usePermission } from '@/composables/usePermission';
import { useStaffStore } from '@/stores/staff';
import { useUserStore } from '@/stores/user';
import type { UserInfo, UserRole } from '@/types/user';

import ChangeRoleModal from './components/modals/ChangeRoleModal.vue';
import ConfirmDeleteModal from './components/modals/ConfirmDeleteModal.vue';
import ResetPasswordModal from './components/modals/ResetPasswordModal.vue';
import UserModal from './components/modals/UserModal.vue';
import SearchToolbar from './components/SearchToolbar.vue';
import StaffTable from './components/StaffTable.vue';

const { isAdmin, isManager } = usePermission();
const userStore = useUserStore();
const staffStore = useStaffStore();

onMounted(() => {
  staffStore.fetchStaff();
});

const canManageStaff = computed(() => isAdmin.value || isManager.value);

// Modal 狀態
const showUserModal = ref(false);
const showChangeRoleModal = ref(false);
const showResetPasswordModal = ref(false);
const showDeleteModal = ref(false);
const selectedUser = ref<UserInfo | null>(null);

// 搜尋與篩選
const searchQuery = ref('');
const filterDepartment = ref('');
const filterRole = ref('');
const filterStatus = ref('');

// 排序
const sortField = ref<string>('');
const sortOrder = ref<'asc' | 'desc'>('asc');

const handleSort = (field: string) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortOrder.value = 'asc';
  }
};

const filteredAndSortedUsers = computed(() => {
  let result = staffStore.users;

  // 搜尋
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (user) =>
        user.username.toLowerCase().includes(query) || user.name?.toLowerCase().includes(query)
    );
  }

  // 篩選部門（僅管理員）
  if (isAdmin.value && filterDepartment.value) {
    result = result.filter((user) => user.department === filterDepartment.value);
  }

  // 篩選權限（僅管理員）
  if (isAdmin.value && filterRole.value) {
    result = result.filter((user) => user.role === filterRole.value);
  }

  // 篩選狀態（僅管理員）
  if (isAdmin.value && filterStatus.value) {
    const status = filterStatus.value === 'true';
    result = result.filter((user) => user.active === status);
  }

  // 部門主管只能看到自己部門的成員
  if (isManager.value && !isAdmin.value) {
    const currentUserDept = userStore.user?.department;
    result = result.filter((user) => user.department === currentUserDept);
  }

  // 排序
  if (sortField.value) {
    result = [...result].sort((a, b) => {
      let aValue: any = a[sortField.value as keyof UserInfo];
      let bValue: any = b[sortField.value as keyof UserInfo];

      // 處理 undefined 值
      if (aValue === undefined || aValue === null) aValue = '';
      if (bValue === undefined || bValue === null) bValue = '';

      // 布林值排序
      if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        const aNum = aValue ? 1 : 0;
        const bNum = bValue ? 1 : 0;
        return sortOrder.value === 'asc' ? aNum - bNum : bNum - aNum;
      }

      // 字串排序
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder.value === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // 數字排序
      if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return result;
});

// 分頁相關
const currentPage = ref(1);
const pageSize = 10;

const total = computed(() => filteredAndSortedUsers.value.length);
const totalPages = computed(() => Math.ceil(total.value / pageSize));
const startIndex = computed(() =>
  Math.min((currentPage.value - 1) * pageSize + 1, total.value || 1)
);
const endIndex = computed(() => Math.min(currentPage.value * pageSize, total.value));

// 分頁後的資料
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return filteredAndSortedUsers.value.slice(start, end);
});

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// CRUD 操作
const handleAdd = () => {
  selectedUser.value = null;
  showUserModal.value = true;
};

const handleEdit = (user: UserInfo) => {
  selectedUser.value = user;
  showUserModal.value = true;
};

const handleChangeRole = (user: UserInfo) => {
  selectedUser.value = user;
  showChangeRoleModal.value = true;
};

const handleResetPassword = (user: UserInfo) => {
  selectedUser.value = user;
  showResetPasswordModal.value = true;
};

const handleDelete = (user: UserInfo) => {
  selectedUser.value = user;
  showDeleteModal.value = true;
};

const handleUserSubmit = (formData: any) => {
  if (selectedUser.value) {
    // 編輯
    const updated = staffStore.updateUser(selectedUser.value.id, formData);
    if (updated) {
      console.log('✅ 使用者已更新:', updated);
    }
  } else {
    // 新增
    const newUser = staffStore.addUser(formData);
    console.log('✅ 使用者已新增:', newUser);
  }
  showUserModal.value = false;
};

const handleRoleSubmit = (userId: string, newRole: UserRole) => {
  const updated = staffStore.updateUserRole(userId, newRole);
  if (updated) {
    console.log('✅ 權限已更新:', updated.username, '→', newRole);
  }
  showChangeRoleModal.value = false;
};

const handlePasswordSubmit = (userId: string, _password: string, mustChange: boolean) => {
  const updated = staffStore.resetUserPassword(userId, mustChange);
  if (updated) {
    console.log('✅ 密碼已重置:', updated.username, '強制修改:', mustChange);
  }
  showResetPasswordModal.value = false;
};

const handleConfirmDelete = () => {
  if (selectedUser.value) {
    const deleted = staffStore.deleteUser(selectedUser.value.id);
    if (deleted) {
      console.log('✅ 使用者已刪除:', deleted.username);
    }
  }
  showDeleteModal.value = false;
  selectedUser.value = null;
};
</script>

<style scoped>
.staff-page {
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
</style>
