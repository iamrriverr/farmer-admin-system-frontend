import { http, HttpResponse } from 'msw';

export const chatHandlers = [
  // 發送訊息
  http.post('*/api/v1/chat/message', async ({ request }) => {
    const { query, useRAG } = (await request.json()) as any;

    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: {
        conversationId: 'conv-mock-123',
        message: {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: `這是針對「${query}」的模擬回覆。${useRAG ? '\n\n此回覆已結合 RAG 知識庫檢索內容。' : ''}\n\n這是一個測試訊息，實際環境將連接後端 LLM。`,
          timestamp: new Date().toISOString(),
          isStreaming: false,
          references: useRAG
            ? [
                {
                  documentId: 'DOC001',
                  documentName: '農會信用部業務規章.pdf',
                  chunkId: 'chunk-1',
                  content: '相關規章內容節錄：申請資格包含具有農保資格之農民...',
                  relevanceScore: 0.95,
                },
              ]
            : [],
        },
      },
    });
  }),

  // 取得對話列表
  http.get('*/api/v1/chat/conversations', () => {
    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: {
        items: [
          {
            id: 'conv-mock-123',
            title: '關於農業補貼的詢問',
            createdAt: '2026-04-01T10:00:00Z',
            updatedAt: '2026-04-03T12:00:00Z',
          },
        ],
        total: 1,
        page: 1,
        pageSize: 20,
        totalPages: 1,
      },
    });
  }),
];
