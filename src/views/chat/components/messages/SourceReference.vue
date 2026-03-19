<script setup lang="ts">
import { useFilePreview } from '@/composables/useFilePreview';
import type { DocumentReference } from '@/types';

interface Props {
  references: DocumentReference[];
}

defineProps<Props>();

// 使用文件預覽 Composable
const { openPreview } = useFilePreview();

/**
 * 處理文件點擊，打開預覽
 */
const handleFileClick = (reference: DocumentReference): void => {
  // Mock 模式下使用公共資源中的 sample.pdf，避免伺服器 404 導致的 Iframe 遞迴渲染（顯示整個 App）
  const isMock = import.meta.env.VITE_USE_MOCK === 'true';
  const fileUrl = isMock 
    ? '/sample.pdf' 
    : `/api/documents/${reference.documentId}/download`;

  openPreview({
    fileName: reference.documentName,
    fileUrl,
    highlightText: reference.content,
  });
};

/**
 * 格式化相關度分數
 */
const formatScore = (score: number): string => {
  return `${Math.round(score * 100)}%`;
};
</script>

<template>
  <div v-if="references && references.length > 0" class="source-references">
    <!-- Header -->
    <div class="source-header">
      <svg class="source-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <span class="source-title">引用來源</span>
      <span class="source-count">{{ references.length }}</span>
    </div>

    <!-- Source List -->
    <div class="source-list">
      <div v-for="(reference, index) in references" :key="reference.chunkId" class="source-item"
        @click="handleFileClick(reference)">
        <!-- 文件編號 -->
        <div class="source-number">{{ index + 1 }}</div>

        <!-- Source Info -->
        <div class="source-info">
          <span class="source-name">{{ reference.documentName }}</span>
          <span class="source-snippet">{{
            reference.content.slice(0, 60) + (reference.content.length > 60 ? '...' : '')
            }}</span>
        </div>

        <!-- Source Score -->
        <div class="source-score">
          <span class="score-value">{{ formatScore(reference.relevanceScore) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ========== 來源引用容器 ========== */
.source-references {
  padding: 0.875rem 1rem;
  margin-top: 1rem;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 0.75rem;
}

/* ========== Header ========== */
.source-header {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.source-icon {
  width: 1.125rem;
  height: 1.125rem;
  color: var(--primary);
}

.source-title {
  flex: 1;
}

.source-count {
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  color: var(--primary);
  background-color: var(--primary-light);
  border-radius: 9999px;
}

/* ========== Source List ========== */
.source-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* ========== Source Item ========== */
.source-item {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  padding: 0.625rem 0.75rem;
  cursor: pointer;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: 0.5rem;

  /* 修正：指定動畫屬性，防止主題切換時背景色彩過渡產生黑閃 */
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.source-item:hover {
  background-color: var(--bg-tertiary);
  border-color: var(--primary);
  box-shadow: 0 2px 4px rgb(0 0 0 / 5%);
  transform: translateY(-1px);
}

/* ========== Source Number ========== */
.source-number {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--primary);
  background-color: var(--primary-light);
  border-radius: 50%;
}

/* ========== Source Info ========== */
.source-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.source-name {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
}

.source-snippet {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.75rem;
  color: var(--text-secondary);
  white-space: nowrap;
}

/* ========== Source Score ========== */
.source-score {
  flex-shrink: 0;
}

.score-value {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--primary);
}

/* ========== 響應式設計 ========== */
@media (width <=768px) {
  .source-references {
    padding: 0.75rem 0.875rem;
  }

  .source-item {
    padding: 0.5rem 0.625rem;
  }

  .source-name {
    font-size: 0.8125rem;
  }

  .source-snippet {
    display: none;

    /* 小螢幕隱藏片段 */
  }
}
</style>
