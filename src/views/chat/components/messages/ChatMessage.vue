<script setup lang="ts">
import { computed } from 'vue';

import { useFilePreview } from '@/composables/useFilePreview'; // Import composable
import { ICONS } from '@/constants';
import type { Message, UploadedFile } from '@/types';
import { formatMarkdown } from '@/utils/format';

import { useChat } from '../../composables/useChat';
import SourceReference from './SourceReference.vue';

interface Props {
  message: Message;
  conversationId?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<Props>();

const { copyMessage, regenerateMessage } = useChat({ conversationId: props.conversationId });
// 使用文件預覽 Composable
const { openPreview } = useFilePreview();

const isUser = computed(() => props.message.role === 'user');

const formattedContent = computed(() => {
  if (isUser.value) {
    return props.message.content;
  }
  return formatMarkdown(props.message.content);
});

const formattedTime = computed(() => {
  return new Date(props.message.timestamp).toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
  });
});

const handleCopy = async () => {
  try {
    await copyMessage(props.message.id);
  } catch (error) {
    console.error('複製失敗:', error);
  }
};

const handleRegenerate = async () => {
  try {
    await regenerateMessage(props.message.id);
  } catch (error) {
    console.error('重新生成失敗:', error);
  }
};

/**
 * 處理附件點擊
 */
const handleAttachmentClick = (file: UploadedFile) => {
  let url = file.url;

  // 確保 file.file 是一個有效的 Blob 或 File 對象
  // 使用 as any 繞過 TS 靜態檢查，因為運行時對象可能已丟失原型鏈
  const rawFile = file.file as any;
  if (
    !url &&
    rawFile &&
    (rawFile instanceof Blob || (typeof File !== 'undefined' && rawFile instanceof File))
  ) {
    try {
      url = URL.createObjectURL(rawFile);
    } catch (e) {
      console.error('無法建立文件預覽 URL:', e);
    }
  }

  if (url) {
    openPreview({
      fileName: file.name,
      fileUrl: url,
    });
  } else {
    // 如果沒有 URL 也沒有有效的 File 對象，這可能是一個異常狀態
    // 但如果有預設的資源路徑（例如範例文件），可以嘗試使用
    console.warn('無法預覽文件: 缺少 URL 或有效的文件對象', file);
  }
};

/**
 * 格式化文件大小
 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Math.round(bytes / Math.pow(k, i))} ${sizes[i]}`;
};
</script>

<template>
  <div :class="['message-wrapper', isUser ? 'message-user-wrapper' : 'message-assistant-wrapper']">
    <div :class="['message-container', isUser ? 'message-user' : 'message-assistant']">
      <!-- Avatar (Assistant only) -->
      <div v-if="!isUser" class="message-avatar">
        <div class="avatar-circle avatar-assistant">
          <svg class="avatar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
      </div>

      <!-- Message Content -->
      <div class="message-content">
        <!-- Attachments (outside bubble, before message) -->
        <div
          v-if="isUser && message.attachments && message.attachments.length > 0"
          class="message-attachments-outside"
        >
          <div
            v-for="file in message.attachments"
            :key="file.id"
            class="attachment-card-outside"
            @click="handleAttachmentClick(file)"
          >
            <svg class="file-icon-outside" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="ICONS.DOCUMENT"
              />
            </svg>
            <div class="file-info-outside">
              <span class="file-name-outside">{{ file.name }}</span>
              <span class="file-meta-outside">{{ formatFileSize(file.size) }}</span>
            </div>
          </div>
        </div>

        <!-- User Message (with bubble) -->
        <div v-if="isUser" class="message-bubble bubble-user">
          <div class="message-text">
            {{ message.content }}
          </div>

          <div class="message-timestamp">
            {{ formattedTime }}
          </div>
        </div>

        <!-- Assistant Message (no bubble, Gemini style) -->
        <div v-else class="message-no-bubble">
          <div class="message-markdown" v-html="formattedContent" />

          <!-- RAG 引用來源 -->
          <SourceReference v-if="message.references" :references="message.references" />

          <div class="message-timestamp">
            {{ formattedTime }}
          </div>
        </div>

        <!-- Message Actions -->
        <div class="message-actions">
          <!-- 複製按鈕 -->
          <button class="action-btn" title="複製" @click="handleCopy">
            <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="ICONS.COPY"
              />
            </svg>
          </button>

          <!-- 重新生成按鈕（僅 AI 消息） -->
          <button v-if="!isUser" class="action-btn" title="重新生成" @click="handleRegenerate">
            <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="ICONS.REGENERATE"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- User avatar removed for Gemini style -->
    </div>
  </div>
</template>

<style scoped>
/* ========== 訊息包裝器（整體容器） ========== */
.message-wrapper {
  width: 100%;
  max-width: 52rem;

  /* Y軸間距：增加到 2rem */
  padding: 0 1rem;

  /* 增加寬度：從 48rem (768px) 到 52rem (832px) */
  margin: 0 auto 2rem;
}

/* ========== 訊息容器 ========== */
.message-container {
  display: flex;
  gap: 1.5rem;

  /* X軸間距：從 1rem 增加到 1.5rem */
  align-items: flex-start;
}

.message-user {
  justify-content: flex-end;

  /* 用戶消息靠右對齊 */
}

.message-assistant {
  flex-direction: row;

  /* AI：頭像在左 */
}

/* ========== 頭像 ========== */
.message-avatar {
  flex-shrink: 0;
}

.avatar-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
}

.avatar-assistant {
  background-color: var(--primary);
}

.avatar-user {
  background-color: var(--text-secondary);
}

.avatar-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: white;
}

/* ========== 訊息內容區域 ========== */
.message-content {
  min-width: 0;
  max-width: 65%;

  /* Gemini 風格：用戶消息最大寬度 */
}

/* AI 回覆使用全寬並填充可用空間 */
.message-assistant .message-content {
  flex: 1;
  max-width: 100%;
}

/* ========== 用戶訊息氣泡（Gemini 風格：有氣泡） ========== */
.message-bubble {
  border-radius: 1.25rem;
}

.bubble-user {
  padding: 0.875rem 1.125rem;
  color: white;
  overflow-wrap: break-word;
  background-color: var(--primary);

  /* Gemini 風格：右上角直角化（聊天氣泡尾巴效果） */
  border-top-right-radius: 0.25rem;
}

/* ========== AI 訊息（Gemini 風格：無氣泡） ========== */
.message-no-bubble {
  width: 100%;

  /* Gemini 風格：AI 回覆使用全寬 */
  padding: 0;
}

/* ========== 訊息文字 ========== */
.message-text {
  line-height: 1.6;
  overflow-wrap: break-word;
  white-space: pre-wrap;
}

/* ========== 時間戳記 ========== */
.message-timestamp {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  opacity: 0.7;
}

/* ========== 附件顯示（氣泡外） ========== */
.message-attachments-outside {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.attachment-card-outside {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 0.75rem;
}

.attachment-card-outside:hover {
  background-color: var(--bg-tertiary);
  border-color: var(--primary);
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.file-icon-outside {
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  color: var(--text-secondary);
}

.file-info-outside {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.file-name-outside {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
}

.file-meta-outside {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* ========== Markdown 內容樣式 ========== */
.message-markdown {
  line-height: 1.6;
  overflow-wrap: break-word;
}

.message-markdown :deep(p) {
  margin-bottom: 0.75rem;
  line-height: 1.6;
}

.message-markdown :deep(p:last-child) {
  margin-bottom: 0;
}

.message-markdown :deep(h1),
.message-markdown :deep(h2),
.message-markdown :deep(h3) {
  margin-top: 1.25rem;
  margin-bottom: 0.625rem;
  font-weight: 600;
  color: var(--text-primary);
}

.message-markdown :deep(h1:first-child),
.message-markdown :deep(h2:first-child),
.message-markdown :deep(h3:first-child) {
  margin-top: 0;
}

.message-markdown :deep(h1) {
  font-size: 1.5rem;
}

.message-markdown :deep(h2) {
  font-size: 1.25rem;
}

.message-markdown :deep(h3) {
  font-size: 1.125rem;
}

/* ========== 列表樣式 ========== */
.message-markdown :deep(ul),
.message-markdown :deep(ol) {
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
}

.message-markdown :deep(li) {
  margin-bottom: 0.375rem;
  line-height: 1.6;
}

/* ========== 程式碼區塊 ========== */
.message-markdown :deep(pre) {
  position: relative;
  padding: 1rem;
  margin: 0.75rem 0;
  overflow-x: auto;
  background-color: var(--bg-tertiary);
  border-radius: 0.5rem;
}

.message-markdown :deep(pre code) {
  padding: 0;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-primary);
  background-color: transparent;
}

/* ========== 行內程式碼 ========== */
.message-markdown :deep(code) {
  padding: 0.125rem 0.375rem;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.875rem;
  color: var(--primary);
  background-color: var(--bg-tertiary);
  border-radius: 0.25rem;
}

.message-markdown :deep(pre code) {
  padding: 0;
  color: var(--text-primary);
  background-color: transparent;
}

/* ========== 連結樣式 ========== */
.message-markdown :deep(a) {
  color: var(--primary);
  text-decoration: underline;
  transition: opacity 0.2s;
}

.message-markdown :deep(a:hover) {
  opacity: 0.8;
}

/* ========== 引用樣式 ========== */
.message-markdown :deep(blockquote) {
  padding-left: 1rem;
  margin: 0.75rem 0;
  font-style: italic;
  color: var(--text-secondary);
  border-left: 3px solid var(--primary);
}

/* ========== 表格樣式 ========== */
.message-markdown :deep(table) {
  width: 100%;
  margin: 0.75rem 0;
  overflow-x: auto;
  border-collapse: collapse;
}

.message-markdown :deep(th),
.message-markdown :deep(td) {
  padding: 0.625rem 0.875rem;
  text-align: left;
  border: 1px solid var(--border-primary);
}

.message-markdown :deep(th) {
  font-weight: 600;
  background-color: var(--bg-secondary);
}

.message-markdown :deep(tr:nth-child(even)) {
  background-color: var(--bg-secondary);
}

/* ========== 水平線 ========== */
.message-markdown :deep(hr) {
  margin: 1rem 0;
  border: none;
  border-top: 1px solid var(--border-primary);
}

/* ========== 圖片樣式 ========== */
.message-markdown :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 0.75rem 0;
  border-radius: 0.5rem;
}

/* ========== 強調樣式 ========== */
.message-markdown :deep(strong) {
  font-weight: 600;
  color: var(--text-primary);
}

.message-markdown :deep(em) {
  font-style: italic;
}

/* ========== 響應式設計 ========== */
@media (width <=768px) {
  .message-container {
    max-width: 100%;
  }

  .bubble-user {
    max-width: 80%;
  }

  .message-markdown :deep(pre) {
    font-size: 0.8125rem;
  }

  .message-markdown :deep(table) {
    font-size: 0.875rem;
  }
}

@media (width <=480px) {
  .bubble-user {
    max-width: 90%;
  }

  .avatar-circle {
    width: 1.75rem;
    height: 1.75rem;
  }

  .avatar-icon {
    width: 1rem;
    height: 1rem;
  }
}

/* ========== 消息操作按鈕 ========== */
.message-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-top: 0.5rem;
  opacity: 0;
}

.message-wrapper:hover .message-actions {
  opacity: 1;
  transition: opacity 0.2s ease;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  color: var(--text-secondary);
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 0.375rem;
}

.action-btn:hover {
  color: var(--text-primary);
  background: var(--bg-tertiary);
  transition: background-color 0.2s ease, color 0.2s ease;
}

.action-icon {
  width: 1.125rem;
  height: 1.125rem;
}
</style>
