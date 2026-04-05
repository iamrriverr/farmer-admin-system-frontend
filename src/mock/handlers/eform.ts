import { http, HttpResponse } from 'msw';

import { MOCK_BUSINESS_TYPES, MOCK_SESSIONS } from '../eform';

export const eformHandlers = [
  // 取得業務別清單
  http.get('*/api/v1/eform/business-types', () => {
    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: MOCK_BUSINESS_TYPES,
    });
  }),

  // 取得單一業務別
  http.get('*/api/v1/eform/business-types/:id', ({ params }) => {
    const businessType = MOCK_BUSINESS_TYPES.find((bt) => bt.id === params.id);
    if (!businessType) {
      return HttpResponse.json({
        code: 20004,
        message: '業務別不存在',
        data: null,
      });
    }
    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: businessType,
    });
  }),

  // 取得模板清單
  http.get('*/api/v1/eform/templates', ({ request }) => {
    const url = new URL(request.url);
    const businessTypeId = url.searchParams.get('businessTypeId');

    let templates = MOCK_BUSINESS_TYPES.flatMap((bt) => bt.templates);
    if (businessTypeId) {
      templates = templates.filter((t) => t.businessTypeId === businessTypeId);
    }

    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: templates,
    });
  }),

  // 生成 PDF
  http.post('*/api/v1/eform/generate', async () => {
    return HttpResponse.json({
      code: 0,
      message: 'PDF 生成成功',
      data: {
        downloadUrl: 'https://example.com/mock-generated.pdf',
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
      },
    });
  }),

  // 取得生成歷程
  http.get('*/api/v1/eform/sessions', () => {
    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: {
        items: MOCK_SESSIONS,
        total: MOCK_SESSIONS.length,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      },
    });
  }),
];
