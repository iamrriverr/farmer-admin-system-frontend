import { http, HttpResponse } from 'msw';

import { mockUsers } from '../staff';

export const authHandlers = [
  // 登入
  http.post('*/api/v1/auth/login', async ({ request }) => {
    const { username } = (await request.json()) as any;
    const user = mockUsers.find((u) => u.username === username);

    if (user) {
      return HttpResponse.json({
        code: 0,
        message: 'success',
        data: {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          mustChangePassword: user.mustChangePassword || false,
          user,
        },
        timestamp: Date.now(),
      });
    }

    return HttpResponse.json({
      code: 10001,
      message: '帳號或密碼錯誤',
      data: null,
      timestamp: Date.now(),
    });
  }),

  // 登出
  http.post('*/api/v1/auth/logout', () => {
    return HttpResponse.json({
      code: 0,
      message: '已成功登出',
      data: null,
      timestamp: Date.now(),
    });
  }),

  // 刷新 Token
  http.post('*/api/v1/auth/refresh', () => {
    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: {
        accessToken: 'mock-new-access-token',
      },
      timestamp: Date.now(),
    });
  }),

  // 修改密碼
  http.post('*/api/v1/auth/change-password', () => {
    return HttpResponse.json({
      code: 0,
      message: '密碼修改成功',
      data: {
        success: true,
        message: '密碼修改成功',
      },
      timestamp: Date.now(),
    });
  }),
];
