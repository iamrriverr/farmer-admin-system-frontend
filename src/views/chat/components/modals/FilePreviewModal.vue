<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

import { useFilePreview } from '@/composables/useFilePreview';

const { isOpen, currentFile, fileType, closePreview } = useFilePreview();

// UI 狀態
const isLoading = ref(false);
const error = ref<string | null>(null);
const textContent = ref('');
const highlightedHtml = ref('');

// 計算 PDF URL，加入搜索參數以實現原生高亮
const pdfUrlWithHighlight = computed(() => {
  if (!currentFile.value.fileUrl) return '';

  let url = currentFile.value.fileUrl;
  // 如果有高亮文本，加入 Chrome/Edge 支援的 search hash
  if (currentFile.value.highlightText) {
    // 移除可能是特殊字符的內容，保留關鍵字
    const cleanTerm = currentFile.value.highlightText.trim().replace(/[#&]/g, '');
    if (cleanTerm) {
      url += `#search="${encodeURIComponent(cleanTerm)}"`;
    }
  }
  return url;
});

// 監聽文件變化
watch(
  () => currentFile.value.fileUrl,
  async (url) => {
    if (isOpen.value && url) {
      await loadFile();
    } else {
      resetState();
    }
  }
);

// 監聽開啟狀態
watch(
  () => isOpen.value,
  (val) => {
    if (!val) resetState();
  }
);

const loadFile = async (): Promise<void> => {
  if (!currentFile.value.fileUrl) return;

  // 重置狀態
  isLoading.value = true;
  error.value = null;

  try {
    // 預檢檔案：確保檔案存在且不是 SPA 重定向後的 HTML (404 狀況)
    const response = await fetch(currentFile.value.fileUrl);
    
    if (!response.ok) {
      throw new Error(`檔案服務器回應異常 (${response.status})`);
    }

    const contentType = response.headers.get('content-type') || '';
    
    // 如果預期是 PDF/圖片，但回傳了文本 HTML，說明發生了 SPA 重定向（伺服器找不到檔案導向了 index.html）
    if (contentType.includes('text/html') && fileType.value !== 'text') {
      throw new Error('找不到該文件路徑，請確認檔案伺服器配置。');
    }

    if (fileType.value === 'text') {
      const text = await response.text();
      textContent.value = text;
      processTextHighlight();
      isLoading.value = false;
    } else if (fileType.value === 'image') {
      isLoading.value = false;
    } else if (fileType.value === 'pdf') {
      // PDF 直接使用 Iframe，預檢成功即可
      isLoading.value = false;
    } else {
      isLoading.value = false;
    }
  } catch (err) {
    console.error('文件預覽失敗:', err);
    error.value = err instanceof Error ? err.message : '載入失敗，請確認路徑或權限';
    isLoading.value = false;
  }
};

const resetState = () => {
  textContent.value = '';
  highlightedHtml.value = '';
  error.value = null;
  isLoading.value = false;
};

// --- 純文本高亮邏輯 ---
const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const escapeHtml = (unsafe: string) => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const processTextHighlight = () => {
  if (!currentFile.value.highlightText || !textContent.value) {
    highlightedHtml.value = escapeHtml(textContent.value);
    return;
  }
  const cleanSource = currentFile.value.highlightText.trim();
  if (!cleanSource) {
    highlightedHtml.value = escapeHtml(textContent.value);
    return;
  }
  try {
    const escaped = escapeRegExp(cleanSource);
    const regex = new RegExp(`(${escaped})`, 'gi');
    highlightedHtml.value = textContent.value.replace(
      regex,
      '<mark class="highlight-mark">$1</mark>'
    );
    setTimeout(() => {
      const mark = document.querySelector('.highlight-mark');
      mark?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  } catch {
    highlightedHtml.value = escapeHtml(textContent.value);
  }
};

const handleDownload = () => {
  if (!currentFile.value.fileUrl) return;
  const link = document.createElement('a');
  link.href = currentFile.value.fileUrl;
  link.download = currentFile.value.fileName;
  link.click();
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen.value) {
    closePreview();
  }
};

onMounted(() => window.addEventListener('keydown', handleKeydown));
onUnmounted(() => window.removeEventListener('keydown', handleKeydown));
</script>

<template>
  <Transition name="slide-in">
    <div v-if="isOpen" class="file-preview-panel">
      <!-- Header -->
      <div class="panel-header">
        <div class="header-left">
          <h3 class="panel-title" :title="currentFile.fileName">{{ currentFile.fileName }}</h3>
        </div>

        <div class="header-actions">
          <!-- PDF 自帶下載功能，僅在非 PDF 時顯示自定義下載按鈕 -->
          <button v-if="fileType !== 'pdf'" class="action-btn download-btn" @click="handleDownload" title="下載">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            <span>下載</span>
          </button>
          <button class="action-btn close-btn" @click="closePreview" title="關閉">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="panel-content">
        <!-- Loading -->
        <div v-if="isLoading" class="state-container loading-state">
          <div class="spinner"></div>
          <p>正在加載預覽...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="state-container error-state">
          <p>{{ error }}</p>
        </div>

        <!-- PDF Viewer (iframe) -->
        <div v-else-if="fileType === 'pdf'" class="viewer-container pdf-container">
          <iframe :src="pdfUrlWithHighlight" class="pdf-iframe" type="application/pdf" frameborder="0"></iframe>
        </div>

        <!-- Image Viewer -->
        <div v-else-if="fileType === 'image'" class="viewer-container image-container">
          <img :src="currentFile.fileUrl" :alt="currentFile.fileName" />
        </div>

        <!-- Text Viewer -->
        <div v-else-if="fileType === 'text'" class="viewer-container text-container">
          <pre v-html="highlightedHtml"></pre>
        </div>

        <!-- Fallback -->
        <div v-else class="state-container fallback-state">
          <p>此格式不支持預覽</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* 面板基礎樣式 (Split View) */
.file-preview-panel {
  position: relative;
  z-index: 50;
  display: flex;
  flex-direction: column;

  /* 寬度設定：預設分屏，扣除右邊 1rem 的邊距 */
  width: calc(50% - 1rem);
  min-width: 450px;
  height: calc(100% - 2rem);

  /* 呼吸感設計：四周留白與圓角 */
  margin: 1rem 1rem 1rem 0;
  overflow: hidden;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
  box-shadow: 0 10px 40px -10px rgb(0 0 0 / 15%);

  /* 移除 all，避免縮放時寬高變動觸發多餘動畫 */
  transition:
    width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 響應式：當視窗縮小時，面板撐滿剩餘空間（對話列表已被 index.vue 隱藏） */
@media (width <=1024px) {
  .file-preview-panel {
    /* 扣除左右各 1rem 的邊距 */
    width: calc(100% - 2rem);

    /* 在小螢幕也保持呼吸感 */
    height: calc(100% - 2rem);
    margin: 1rem;
    border-radius: 16px;
    box-shadow: none;
  }
}

.panel-header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  background-color: var(--bg-primary, #fff);

  /* 白色背景 */
  border-bottom: 1px solid var(--border-primary, #e2e8f0);
}

.header-left {
  display: flex;
  flex: 1;
  gap: 1rem;
  align-items: center;
  overflow: hidden;
}

.panel-title {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary, #1e293b);
  white-space: nowrap;
}

.header-actions {
  display: flex;
  flex-shrink: 0;
  gap: 0.5rem;
  align-items: center;
}

.action-btn {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  border-radius: 6px;
  transition: all 0.2s;
}

.download-btn {
  color: white;
  background-color: var(--primary, #00ad68);
}

.download-btn:hover {
  opacity: 0.9;
}

.close-btn {
  padding: 0.25rem;
  color: var(--text-secondary);
  background: transparent;
}

.close-btn:hover {
  color: var(--error, #ef4444);
  background-color: var(--bg-tertiary);
}

.panel-content {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  background-color: #525659;
}

.viewer-container {
  display: flex;
  flex: 1;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;

  /* 讓 iframe 自己處理滾動 */
}

.pdf-container {
  background-color: #525659;
}

.pdf-iframe {
  width: 100%;
  height: 100%;
  background-color: white;
  border: none;
}

.image-container {
  align-items: center;
  padding: 1rem;
  overflow: auto;

  /* 圖片需要容器滾動 */
}

.image-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 10%);
}

.text-container {
  /* 文本需要容器滾動 */
  align-items: flex-start;
  padding: 1.5rem;
  overflow-y: auto;
  background-color: white;
}

.text-container pre {
  width: 100%;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  white-space: pre-wrap;
}

.text-container :deep(.highlight-mark) {
  padding: 2px 0;
  color: #000;
  background-color: #fef08a;
  border-bottom: 2px solid #ef4444;
}

.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: white;
}

.spinner {
  width: 32px;
  height: 32px;
  margin-bottom: 0.75rem;
  border: 3px solid rgb(255 255 255 / 30%);
  border-right-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* 
  滑入/滑出動畫優化 
  重點：同時過渡 opacity, transform, 和影響佈局的屬性 (width, margin, flex)
*/
.slide-in-enter-active,
.slide-in-leave-active {
  overflow: hidden;

  /* 防止內容溢出 */
  white-space: nowrap;
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);

  /* 防止文字換行導致高度劇烈變化 */
}

.slide-in-enter-from,
.slide-in-leave-to {
  flex-grow: 0 !important;
  flex-basis: 0 !important;

  /* 關鍵：讓所有影響寬度的屬性歸零，實現平滑推擠 */
  width: 0 !important;
  min-width: 0 !important;
  margin-right: 0 !important;
  margin-left: 0 !important;
  opacity: 0;
  transform: translateX(20px);
}
</style>
