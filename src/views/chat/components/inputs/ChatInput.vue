<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useFileUpload } from '@/composables/useFileUpload';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ICONS } from '@/constants';
import { useChatStore } from '@/stores/chat';

import UploadedFileList from './UploadedFileList.vue';

interface Props {
  conversationId?: string;
}

const props = defineProps<Props>();
const chatStore = useChatStore();
const router = useRouter();

const inputText = ref<string>('');
const textareaRef = ref<HTMLDivElement | null>(null);
const isComposing = ref<boolean>(false);
const isDragging = ref<boolean>(false);

// 文件上傳
const { files, selectFiles, handleFiles, removeFile, clearFiles, canAddMore } = useFileUpload({
  maxSize: 10 * 1024 * 1024, // 10MB
  maxCount: 5,
  accept: [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
  ],
  multiple: true,
  autoUpload: false,
});

const canSend = computed(() => inputText.value.trim().length > 0 && !chatStore.isLoading);

const handleInput = (event: Event): void => {
  const target = event.target as HTMLDivElement;
  inputText.value = target.textContent || '';
};

const handleSend = async (): Promise<void> => {
  if (!canSend.value) return;

  const message = inputText.value.trim();

  // 保存文件引用（在清空前）
  const attachedFiles = files.value.length > 0 ? [...files.value] : undefined;

  // 清空輸入框
  if (textareaRef.value) {
    textareaRef.value.textContent = '';
  }
  inputText.value = '';

  // 清空文件列表
  clearFiles();

  try {
    // 傳遞文件附件
    const conversationId = await chatStore.sendMessage(
      props.conversationId,
      message,
      attachedFiles,
      true // 預設開啟 RAG
    );

    if (!props.conversationId && conversationId) {
      router.push(`/chat/${conversationId}`);
    }
  } catch (error) {
    console.error('發送訊息失敗:', error);
  }
};

const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Enter' && !event.shiftKey && !isComposing.value) {
    event.preventDefault();
    handleSend();
  }
};

const handleCompositionStart = (): void => {
  isComposing.value = true;
};

const handleCompositionEnd = (): void => {
  isComposing.value = false;
};

const handlePaste = (event: ClipboardEvent): void => {
  event.preventDefault();
  const text = event.clipboardData?.getData('text/plain');
  if (text) {
    document.execCommand('insertText', false, text);
  }
};

// 文件上傳處理
const handleUpload = (): void => {
  if (canAddMore()) {
    selectFiles();
  }
};

// 拖放處理
let dragCounter = 0; // 追蹤拖放層級

const handleDragEnter = (event: DragEvent): void => {
  event.preventDefault();
  dragCounter++;
  isDragging.value = true;
};

const handleDragOver = (event: DragEvent): void => {
  event.preventDefault();
};

const handleDragLeave = (event: DragEvent): void => {
  event.preventDefault();
  dragCounter--;
  if (dragCounter === 0) {
    isDragging.value = false;
  }
};

const handleDrop = async (event: DragEvent): Promise<void> => {
  event.preventDefault();
  dragCounter = 0;
  isDragging.value = false;

  const droppedFiles = event.dataTransfer?.files;
  if (droppedFiles && droppedFiles.length > 0) {
    await handleFiles(droppedFiles);
  }
};

const handleRemoveFile = (fileId: string): void => {
  removeFile(fileId);
};
</script>

<template>
  <div class="input-container input-gradient">
    <!-- 已上傳文件列表（顯示在輸入框上方） -->
    <UploadedFileList :files="files" @remove="handleRemoveFile" />

    <div class="input-area-container" :class="{ 'drag-over': isDragging }" @dragenter="handleDragEnter"
      @dragover="handleDragOver" @dragleave="handleDragLeave" @drop="handleDrop">
      <!-- 拖放提示覆蓋層 -->
      <div v-if="isDragging" class="drag-overlay">
        <div class="drag-content">
          <svg class="drag-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="ICONS.UPLOAD" />
          </svg>
          <p class="drag-text">將檔案拖曳到這裡</p>
        </div>
      </div>
      <div class="input-area-wrapper">
        <div class="textarea-row">
          <div class="textarea-container scrollbar-custom">
            <div ref="textareaRef" contenteditable="true" role="textbox" :data-placeholder="inputText ? '' : '輸入訊息...'"
              class="rich-textarea scrollbar-custom" :class="{ disabled: chatStore.isLoading }" @input="handleInput"
              @keydown="handleKeydown" @compositionstart="handleCompositionStart" @compositionend="handleCompositionEnd"
              @paste="handlePaste"></div>
          </div>
        </div>

        <!-- 第二行：操作按鈕 -->
        <div class="actions-row">
          <!-- 左側：上傳按鈕 -->
          <div class="actions-left">
            <button type="button" class="action-button" @click="handleUpload" title="附加檔案">
              <span class="button-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </span>
            </button>
          </div>

          <!-- 右側：發送按鈕 -->
          <div class="actions-right">
            <button type="button" class="send-button" :class="{ active: canSend }" :disabled="!canSend"
              @click="handleSend" title="發送訊息">
              <span v-if="!chatStore.isLoading" class="send-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </span>
              <span v-else class="loading-spinner">
                <svg viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none">
                  </circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="input-disclaimer">
      <p>AI 可能會出錯，請小心查證</p>
    </div>
  </div>
</template>

<style scoped>
/* ========== 主容器 ========== */
.input-container {
  position: relative;
  z-index: 2;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-self: center;
  justify-content: flex-end;
  width: 100%;
  min-height: 50px;
  padding-inline: 16px;
  padding-bottom: 1.5rem;

  /* 往上移動：減少底部內距 */
  background: var(--bg-primary);
}

/* ========== 漸層淡出效果 ========== */
.input-gradient::before {
  position: absolute;
  top: -60px;
  right: 0;
  left: 0;
  z-index: 1;
  height: 60px;
  pointer-events: none;
  content: '';

  /* 使用 CSS 變數，淺色模式自動使用 #fcfcf9 */
  background: linear-gradient(to bottom,
      transparent 0%,
      color-mix(in srgb, var(--bg-primary) 30%, transparent) 20%,
      color-mix(in srgb, var(--bg-primary) 70%, transparent) 50%,
      color-mix(in srgb, var(--bg-primary) 90%, transparent) 75%,
      var(--bg-primary) 100%);
}

/* ========== 輸入區域容器 ========== */
.input-area-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 52rem;
  margin: 0 auto;
}

.input-area-wrapper {
  position: relative;
  width: 100%;
  padding: 12px;
  background: var(--bg-primary);
  border-radius: 26px;

  /* 增加圓角：從 16px 到 26px */
  box-shadow:
    0 2px 6px rgb(0 0 0 / 12%),
    0 0 0 1px var(--border-primary);
  transition: box-shadow 0.2s cubic-bezier(0.2, 0, 0, 1);
}

.input-area-wrapper:focus-within {
  box-shadow:
    0 4px 12px rgb(0 0 0 / 16%),
    0 0 0 2px var(--primary);
}

/* ========== 第一行：輸入區域 ========== */
.textarea-row {
  width: 100%;
  margin-bottom: 8px;
}

.textarea-container {
  width: 100%;
  min-height: 40px;
  max-height: 200px;
  overflow-y: auto;
}

.rich-textarea {
  width: 100%;
  min-height: 40px;
  padding-left: 8px;

  /* 添加左側內距，與上傳按鈕對齊 */
  font-size: 16px;
  line-height: 1.5;
  color: var(--text-primary);
  overflow-wrap: break-word;
  white-space: pre-wrap;
  cursor: text;
  outline: none;
}

.rich-textarea[data-placeholder]:empty::before {
  font-size: 1.0625rem;

  /* 17px - 增加字體大小 */
  font-weight: 500;

  /* 粗體 */
  color: var(--text-tertiary);
  content: attr(data-placeholder);
}

.rich-textarea.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* 捲軸由外層容器透過 scrollbar-custom 統一處理 */
.textarea-container::-webkit-scrollbar {
  display: none;
}

/* ========== 第二行：操作按鈕 ========== */
.actions-row {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
}

.actions-left,
.actions-right {
  display: flex;
  align-items: center;
}

/* 上傳按鈕 */
.action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: var(--text-secondary);
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 8px;
}

.action-button:hover {
  color: var(--primary);
  background: var(--bg-secondary);
  transition: all 0.15s;
}

.button-icon {
  display: flex;
  width: 20px;
  height: 20px;
}

/* 發送按鈕 */
.send-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: var(--text-tertiary);
  cursor: not-allowed;
  background: var(--bg-tertiary);
  border: none;
  border-radius: 8px;
}

.send-button.active {
  color: white;
  cursor: pointer;
  background: var(--primary);
}

.send-button.active:hover {
  background: var(--primary-hover);
  transition: background-color 0.15s;
}

.send-icon,
.loading-spinner {
  display: flex;
  width: 20px;
  height: 20px;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ========== 底部提示 ========== */
.input-disclaimer {
  padding: 12px 0;
  text-align: center;
}

.input-disclaimer p {
  font-size: 12px;
  color: var(--text-tertiary);
}

/* ========== 拖放樣式 ========== */
.input-area-container {
  position: relative;

  /* 移除 all，僅針對拖放狀態進行必要的邊框過渡 */
  transition: border-color 0.2s ease;
}

.input-area-container.drag-over {
  border-color: var(--primary);
}

.drag-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(var(--primary-rgb), 0.04);
  border: 2px dashed var(--primary);
  border-radius: 26px;
  backdrop-filter: blur(24px);
}

.drag-content {
  text-align: center;
}

.drag-icon {
  width: 1.5rem;
  height: 1.5rem;
  margin: 0 auto 0.75rem;
}

.drag-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--primary);
}

/* ========== 響應式 ========== */
@media (width <=768px) {
  .input-container {
    padding-inline: 8px;
  }
}
</style>
