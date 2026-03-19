import { defineStore } from 'pinia';
import type { UserInfo, UserRole } from '@/types/user';

import { mockUsers } from '@/mock/staff';

interface StaffState {
  users: UserInfo[];
}

export const useStaffStore = defineStore('staff', {
  state: (): StaffState => ({
    // 若為 Mock 模式則載入假帳號，否則預設空陣列等待 API 更新
    users: import.meta.env.VITE_USE_MOCK === 'true' ? mockUsers : [],
  }),

  getters: {
    // 獲取所有主管（部門主管和系統管理員）
    managers: (state) =>
      state.users.filter((u) => (u.role === 'manager' || u.role === 'admin') && u.active),

    // 根據部門獲取使用者
    getUsersByDepartment: (state) => (department: string) => {
      return state.users.filter((u) => u.department === department);
    },

    // 根據 ID 獲取使用者
    getUserById: (state) => (id: string) => {
      return state.users.find((u) => u.id === id);
    },

    // 根據帳號獲取使用者
    getUserByUsername: (state) => (username: string) => {
      return state.users.find((u) => u.username === username);
    },
  },

  actions: {
    // 新增使用者
    addUser(formData: any) {
      const newUser: UserInfo = {
        id: `USER${String(this.users.length + 1).padStart(3, '0')}`,
        username: formData.username,
        name: formData.name,
        role: formData.role,
        department: formData.department || '',
        active: true,
        mustChangePassword: formData.mustChangePassword,
        createdAt: new Date().toLocaleString('zh-TW', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }),
        lastLoginAt: undefined,
      };
      this.users.push(newUser);
      return newUser;
    },

    // 更新使用者
    updateUser(id: string, formData: any) {
      const index = this.users.findIndex((u) => u.id === id);
      if (index !== -1) {
        this.users[index] = {
          ...this.users[index],
          name: formData.name,
          role: formData.role,
          department: formData.department || '',
        };
        return this.users[index];
      }
      return null;
    },

    // 更新使用者權限
    updateUserRole(id: string, newRole: UserRole) {
      const index = this.users.findIndex((u) => u.id === id);
      if (index !== -1) {
        this.users[index].role = newRole;
        return this.users[index];
      }
      return null;
    },

    // 重置使用者密碼
    resetUserPassword(id: string, mustChange: boolean) {
      const index = this.users.findIndex((u) => u.id === id);
      if (index !== -1) {
        this.users[index].mustChangePassword = mustChange;
        return this.users[index];
      }
      return null;
    },

    // 刪除使用者
    deleteUser(id: string) {
      const index = this.users.findIndex((u) => u.id === id);
      if (index !== -1) {
        const deleted = this.users[index];
        this.users.splice(index, 1);
        return deleted;
      }
      return null;
    },
  },
});
