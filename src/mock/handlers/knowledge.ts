import { http, HttpResponse } from 'msw';

import { mockDocuments } from '../knowledge';

export const knowledgeHandlers = [
  // 取得文件列表
  http.get('*/api/v1/knowledge/documents', () => {
    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: {
        items: mockDocuments,
        total: mockDocuments.length,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      },
    });
  }),

  // 取得單一文件
  http.get('*/api/v1/knowledge/documents/:id', ({ params }) => {
    const document = mockDocuments.find((d) => d.id === params.id);
    if (!document) {
      return HttpResponse.json({
        code: 40001,
        message: '文件不存在或已被刪除',
        data: null,
      });
    }
    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: document,
    });
  }),

  // 上傳文件
  http.post('*/api/v1/knowledge/documents', async () => {
    // 模擬上傳延遲
    return HttpResponse.json({
      code: 0,
      message: '文件上傳成功，正在處理向量化',
      data: {
        id: `DOC${Math.floor(Math.random() * 1000)}`,
        title: '新上傳文件',
        filename: 'new_file.pdf',
        fileSize: 1024 * 1024,
        mimeType: 'application/pdf',
        category: '業務規章',
        status: 'processing',
        uploadedBy: '系統管理員',
        uploadedAt: new Date().toISOString(),
        chunkCount: 0,
      },
    });
  }),

  // 取得分類清單
  http.get('*/api/v1/knowledge/categories', () => {
    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: ['業務規章', '業務流程', '法規', '內部知識'],
    });
  }),
];
