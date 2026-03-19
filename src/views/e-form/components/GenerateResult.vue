<template>
  <div class="generate-result">
    <!-- 成功動畫區塊 -->
    <div class="success-banner">
      <div class="success-icon-wrap">
        <svg class="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <p class="success-title">表單已生成完成</p>
        <p class="success-sub">
          共生成 {{ templates.length }} 份表單 ·
          <span class="business-badge">{{ businessTypeName }}</span>
        </p>
      </div>
    </div>

    <!-- 申請人資訊摘要 -->
    <div class="info-summary">
      <div class="summary-title">已填入資訊摘要</div>
      <div class="summary-grid">
        <div v-for="(val, key) in filledData" :key="key" class="summary-item">
          <span class="summary-key">{{ labelOf(String(key)) }}</span>
          <span class="summary-val">{{ val }}</span>
        </div>
      </div>
    </div>

    <!-- 生成的表單清單 -->
    <div class="files-list">
      <div class="files-header">
        <span class="files-title">生成的表單檔案</span>
        <button class="btn-zip" @click="handleDownloadAll">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="btn-icon">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          全部下載 ZIP
        </button>
      </div>

      <div class="file-items">
        <div v-for="tmpl in templates" :key="tmpl.id" class="file-item">
          <div class="file-left">
            <div class="pdf-icon-wrap">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="pdf-icon">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <span class="file-pdf">{{ tmpl.pdfFileName }}</span>
          </div>
          <button class="btn-download" @click="handleDownload(tmpl)">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="btn-icon">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            下載
          </button>
        </div>
      </div>
    </div>

    <!-- 操作按鈕 -->
    <div class="action-row">
      <button class="btn-restart" @click="emit('restart')">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="btn-icon">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        重新生成
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { EFormTemplate } from '@/types/form';

const LABEL_MAP: Record<string, string> = {
  applicant_name: '申請人姓名',
  applicant_id_number: '身分證字號',
  applicant_birth_date: '出生日期',
  applicant_phone: '聯絡電話',
  applicant_address: '戶籍地址',
  applicant_email: 'E-mail',
  institution_name: '機構/公司名稱',
  institution_tax_id: '統一編號',
};

const props = defineProps<{
  templates: EFormTemplate[];
  businessTypeName: string;
  filledData: Record<string, string>;
}>();

const emit = defineEmits<{
  (e: 'restart'): void;
}>();

function labelOf(key: string): string {
  return LABEL_MAP[key] ?? key;
}

function handleDownload(tmpl: EFormTemplate) {
  // TODO: 後端整合後實作下載機制 (ex: window.open(`/api/forms/download/${tmpl.id}`, '_blank');)
  console.warn('[handleDownload] 尚未串接後端 API 下載', tmpl);
}

function handleDownloadAll() {
  // TODO: 後端整合後打包下載 ZIP
  console.warn('[handleDownloadAll] 尚未串接後端 API 打包下載', props.templates);
}
</script>

<style scoped>
.generate-result {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* 成功 Banner */
.success-banner {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: color-mix(in srgb, #22c55e 8%, var(--bg-secondary));
  border: 1px solid color-mix(in srgb, #22c55e 30%, transparent);
  border-radius: 0.75rem;
}

.success-icon-wrap {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background: #22c55e;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 0 0 6px color-mix(in srgb, #22c55e 20%, transparent);
}

.success-icon {
  width: 1.375rem;
  height: 1.375rem;
  color: white;
}

.success-title {
  margin: 0 0 0.2rem;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.success-sub {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.business-badge {
  padding: 0.2rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--primary);
  background: color-mix(in srgb, var(--primary) 12%, transparent);
  border-radius: 1rem;
}

/* 摘要 */
.info-summary {
  padding: 1rem 1.25rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 0.625rem;
}

.summary-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.5rem 1rem;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.summary-key {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.summary-val {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary);
}

/* 檔案列表 */
.files-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.files-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.files-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
}

.btn-zip {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--primary);
  background: color-mix(in srgb, var(--primary) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--primary) 30%, transparent);
  border-radius: 0.5rem;
  cursor: pointer;
}

.btn-zip:hover {
  background: color-mix(in srgb, var(--primary) 18%, transparent);
  transition: background-color 0.2s ease;
}

.file-items {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.25rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 0.625rem;
}

.file-item:hover {
  border-color: color-mix(in srgb, var(--primary) 40%, transparent);
  transition: border-color 0.2s ease;
}

.file-left {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.pdf-icon-wrap {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  background: color-mix(in srgb, #ef4444 12%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pdf-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #ef4444;
}

.file-detail {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.file-name {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-primary);
}

.file-pdf {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.btn-download {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: white;
  background: var(--primary);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  flex-shrink: 0;
}

.btn-download:hover {
  background: var(--primary-hover);
  transition: background-color 0.2s ease;
}

.btn-icon {
  width: 1rem;
  height: 1rem;
}

/* 操作列 */
.action-row {
  display: flex;
  justify-content: flex-end;
}

.btn-restart {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 0.5rem;
  cursor: pointer;
}

.btn-restart:hover {
  background: var(--bg-primary);
  border-color: var(--primary);
  color: var(--primary);
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}


</style>
