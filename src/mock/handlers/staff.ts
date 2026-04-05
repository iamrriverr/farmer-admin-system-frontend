import { http, HttpResponse } from 'msw';

import { mockUsers } from '../staff';

export const staffHandlers = [
  // 取得人員列表
  http.get('*/api/v1/staff', () => {
    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: {
        items: mockUsers,
        total: mockUsers.length,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      },
    });
  }),

  // 取得單一人員
  http.get('*/api/v1/staff/:id', ({ params }) => {
    const user = mockUsers.find((u) => u.id === params.id);
    if (!user) {
      return HttpResponse.json({
        code: 20004,
        message: '人員不存在',
        data: null,
      });
    }
    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: user,
    });
  }),

  // 新增人員
  http.post('*/api/v1/staff', async ({ request }) => {
    const newUser = (await request.json()) as any;
    return HttpResponse.json({
      code: 0,
      message: '人員帳號建立成功',
      data: {
        ...newUser,
        id: `USER${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date().toISOString(),
      },
    });
  }),
];
