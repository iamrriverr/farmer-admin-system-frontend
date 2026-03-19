// 訊息角色
export type MessageRole = 'user' | 'assistant' | 'system';

// 單條訊息
export interface Message {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: Date;
  isStreaming?: boolean;
  references?: import('./rag').DocumentReference[]; // RAG 引用來源
  attachments?: import('./upload').UploadedFile[]; // 文件附件
}

// 對話
export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

// 聊天狀態
export interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  error: string | null;
}
