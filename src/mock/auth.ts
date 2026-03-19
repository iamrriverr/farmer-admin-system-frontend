import type {
  LoginRequest,
  LoginResponse,
} from '@/types/auth';

export async function mockLoginData(credentials: LoginRequest): Promise<LoginResponse> {
  const mockUsers = {
    admin: {
      password: 'admin123',
      user: {
        id: 'U2026001',
        username: 'admin',
        name: '系統管理員',
        role: 'admin' as const,
        department: '資訊部',
        mustChangePassword: false,
      },
    },
    manager: {
      password: 'manager123',
      user: {
        id: 'U2026002',
        username: 'manager',
        name: '王經理',
        role: 'manager' as const,
        department: '信用部',
        mustChangePassword: true,
      },
    },
    user: {
      password: 'user123',
      user: {
        id: 'U2026003',
        username: 'user',
        name: '李員工',
        role: 'user' as const,
        department: '行政部',
        mustChangePassword: false,
      },
    },
  };

  const account = mockUsers[credentials.username as keyof typeof mockUsers];

  if (!account || account.password !== credentials.password) {
    throw new Error('帳號或密碼錯誤');
  }

  return {
    accessToken: `mock-token-${credentials.username}-${Date.now()}`,
    user: account.user,
    mustChangePassword: account.user.mustChangePassword,
  };
}

export const mockPasswords: Record<string, string> = {
  admin: 'admin123',
  manager: 'manager123',
  user: 'user123',
};
