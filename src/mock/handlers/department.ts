import { http, HttpResponse } from 'msw';

import { mockDepartments } from '../department';

export const departmentHandlers = [
  // 取得部門列表
  http.get('*/api/v1/departments', () => {
    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: {
        items: mockDepartments,
        total: mockDepartments.length,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      },
    });
  }),

  // 取得單一部門
  http.get('*/api/v1/departments/:id', ({ params }) => {
    const department = mockDepartments.find((d) => d.id === params.id);
    if (!department) {
      return HttpResponse.json({
        code: 20004,
        message: '部門不存在',
        data: null,
      });
    }
    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: department,
    });
  }),

  // 新增部門
  http.post('*/api/v1/departments', async ({ request }) => {
    const newDept = (await request.json()) as any;
    return HttpResponse.json({
      code: 0,
      message: '部門建立成功',
      data: {
        ...newDept,
        id: `DEPT${Math.floor(Math.random() * 1000)}`,
        memberCount: 0,
        knowledgeBaseCount: 0,
        createdAt: new Date().toISOString(),
      },
    });
  }),
];
