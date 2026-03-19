import { defineStore } from 'pinia';
import { DocumentStatus } from '@/types/knowledge';
import type { KnowledgeDocument } from '@/types/knowledge';
import { mockDocuments } from '@/mock/knowledge';

interface KnowledgeState {
  documents: KnowledgeDocument[];
  isLoading: boolean;
  error: string | null;
}

export const useKnowledgeStore = defineStore('knowledge', {
  state: (): KnowledgeState => ({
    documents: import.meta.env.VITE_USE_MOCK === 'true' ? mockDocuments : [],
    isLoading: false,
    error: null,
  }),

  getters: {
    // 所有可用分類
    categories: (state): string[] => {
      const cats = new Set(state.documents.map((d) => d.category).filter(Boolean));
      return Array.from(cats);
    },

    // 所有可用部門
    departments: (state): string[] => {
      const depts = new Set(state.documents.map((d) => d.department).filter(Boolean));
      return Array.from(depts);
    },
  },

  actions: {
    async fetchDocuments() {
      try {
        this.isLoading = true;
        this.error = null;

        if (import.meta.env.VITE_USE_MOCK === 'true') {
          // 模擬網路延遲
          await new Promise(resolve => setTimeout(resolve, 500));
          this.documents = mockDocuments;
          return;
        }

        // TODO: 串接真實 API
        console.warn('[fetchDocuments] 尚未串接後端 API，且 Mock 被關閉。');
      } catch (err) {
        this.error = '載入文件列表失敗';
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },

    addDocument(doc: Omit<KnowledgeDocument, 'id' | 'uploadedAt' | 'updatedAt' | 'status' | 'chunkCount'>) {
      const now = new Date().toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });

      const newDoc: KnowledgeDocument = {
        ...doc,
        id: `DOC${String(this.documents.length + 1).padStart(3, '0')}`,
        status: DocumentStatus.PROCESSING,
        chunkCount: 0,
        uploadedAt: now,
        updatedAt: now,
      };

      this.documents.push(newDoc);

      // 模擬處理完成（3 秒後變 READY）
      setTimeout(() => {
        const index = this.documents.findIndex((d) => d.id === newDoc.id);
        if (index !== -1) {
          this.documents[index].status = DocumentStatus.READY;
          this.documents[index].chunkCount = Math.floor(Math.random() * 50) + 10;
        }
      }, 3000);

      return newDoc;
    },

    updateDocument(id: string, data: Partial<Pick<KnowledgeDocument, 'title' | 'category' | 'department' | 'tags' | 'description'>>) {
      const index = this.documents.findIndex((d) => d.id === id);
      if (index !== -1) {
        const now = new Date().toLocaleString('zh-TW', {
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
        });
        this.documents[index] = { ...this.documents[index], ...data, updatedAt: now };
        return this.documents[index];
      }
      return null;
    },

    deleteDocument(id: string) {
      const index = this.documents.findIndex((d) => d.id === id);
      if (index !== -1) {
        const deleted = this.documents[index];
        this.documents.splice(index, 1);
        return deleted;
      }
      return null;
    },
  },
});
