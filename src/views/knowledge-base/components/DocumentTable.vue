<template>
  <div class="table-container">
    <table class="data-table">
      <thead>
        <tr>
          <th @click="$emit('sort', 'title')" class="sortable">
            文件標題
            <span class="sort-icon">{{ getSortIcon('title') }}</span>
          </th>
          <th>分類</th>
          <th v-if="isAdmin">部門</th>
          <th @click="$emit('sort', 'fileSize')" class="sortable">
            大小
            <span class="sort-icon">{{ getSortIcon('fileSize') }}</span>
          </th>
          <th>狀態</th>
          <th>上傳者</th>
          <th @click="$emit('sort', 'uploadedAt')" class="sortable">
            上傳時間
            <span class="sort-icon">{{ getSortIcon('uploadedAt') }}</span>
          </th>
          <th class="col-actions">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="documents.length === 0">
          <td :colspan="isAdmin ? 8 : 7" class="empty-cell">
            <div class="empty-state">
              <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>尚無文件，請點擊「上傳文件」新增</p>
            </div>
          </td>
        </tr>

        <tr v-for="doc in documents" :key="doc.id" class="clickable-row" @click="$emit('detail', doc)">
          <!-- 文件標題欄 -->
          <td class="col-title">
            <div class="doc-title-cell">
              <span class="file-icon" :class="getFileIconClass(doc.mimeType)">
                {{ getFileIconLabel(doc.mimeType) }}
              </span>
              <div class="doc-info">
                <span class="doc-title-text">{{ doc.title }}</span>
                <span class="doc-filename">{{ doc.filename }}</span>
                <div v-if="doc.tags.length" class="doc-tags">
                  <span v-for="tag in doc.tags.slice(0, 3)" :key="tag" class="doc-tag">{{ tag }}</span>
                </div>
              </div>
            </div>
          </td>

          <!-- 分類（純文字） -->
          <td>{{ doc.category }}</td>

          <!-- 部門（純文字，僅管理員） -->
          <td v-if="isAdmin">{{ doc.department || '公開' }}</td>

          <!-- 大小 -->
          <td>{{ formatFileSize(doc.fileSize) }}</td>

          <!-- 狀態 -->
          <td>
            <span class="status-badge" :class="getStatusClass(doc.status)">
              {{ getStatusLabel(doc.status) }}
            </span>
          </td>

          <!-- 上傳者 -->
          <td>{{ doc.uploadedBy }}</td>

          <!-- 上傳時間 -->
          <td class="col-nowrap">{{ doc.uploadedAt }}</td>

          <!-- 操作 -->
          <td class="col-actions" @click.stop>
            <div class="action-buttons">
              <!-- 眼睛：開新分頁預覽原始文件 -->
              <button class="btn-icon" title="開啟文件預覽" @click="$emit('preview', doc)">
                <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>

              <!-- 編輯：管理員或主管 -->
              <button v-if="canEdit" class="btn-icon" title="編輯文件資訊" @click="$emit('edit', doc)">
                <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>

              <!-- 刪除：僅管理員 -->
              <button v-if="isAdmin" class="btn-icon btn-danger" title="刪除" @click="$emit('delete', doc)">
                <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { KnowledgeDocument } from '@/types/knowledge';

const props = defineProps<{
  documents: KnowledgeDocument[];
  isAdmin: boolean;
  isManager: boolean;
  sortField: string;
  sortOrder: 'asc' | 'desc';
}>();

defineEmits<{
  (e: 'detail', doc: KnowledgeDocument): void;
  (e: 'preview', doc: KnowledgeDocument): void;
  (e: 'edit', doc: KnowledgeDocument): void;
  (e: 'delete', doc: KnowledgeDocument): void;
  (e: 'sort', field: string): void;
}>();

// 排序圖示（與 StaffTable 相同）
const getSortIcon = (field: string) => {
  if (props.sortField !== field) return '⇅';
  return props.sortOrder === 'asc' ? '↑' : '↓';
};

// 編輯權限
const canEdit = props.isAdmin || props.isManager;

// 檔案大小格式
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// 檔案類型圖示
const MIME_MAP: Record<string, { label: string; cls: string }> = {
  'application/pdf': { label: 'PDF', cls: 'icon-pdf' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { label: 'DOC', cls: 'icon-word' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { label: 'XLS', cls: 'icon-excel' },
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': { label: 'PPT', cls: 'icon-ppt' },
  'text/plain': { label: 'TXT', cls: 'icon-txt' },
};
const getFileIconLabel = (mime: string) => MIME_MAP[mime]?.label ?? 'FILE';
const getFileIconClass = (mime: string) => MIME_MAP[mime]?.cls ?? 'icon-default';

// 狀態
const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  ready: { label: '已就緒', cls: 'status-ready' },
  processing: { label: '處理中', cls: 'status-processing' },
  uploading: { label: '上傳中', cls: 'status-processing' },
  error: { label: '錯誤', cls: 'status-error' },
};
const getStatusLabel = (s: string) => STATUS_MAP[s]?.label ?? s;
const getStatusClass = (s: string) => STATUS_MAP[s]?.cls ?? '';
</script>

<style scoped>
.table-container {
  margin-bottom: 1.5rem;
  overflow-x: auto;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 0.75rem;
}

.data-table {
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
}

/* ── Header ── */
.data-table thead th {
  padding: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-align: left;
  white-space: nowrap;
  background: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-primary);
}

.data-table thead th.sortable {
  cursor: pointer;
  user-select: none;
  transition: color 0.2s;
}

.data-table thead th.sortable:hover {
  color: var(--primary);
}

.sort-icon {
  margin-left: 0.25rem;
  font-size: 0.75rem;
  opacity: 0.5;
}

/* ── Body ── */
.data-table tbody tr {
  border-bottom: 1px solid var(--border-secondary);
}

.data-table tbody tr:last-child {
  border-bottom: none;
}

.clickable-row {
  cursor: pointer;
}

.data-table tbody tr:hover {
  background: var(--bg-tertiary);
}

.data-table tbody td {
  padding: 1rem;
  font-size: 0.875rem;
  color: var(--text-primary);
  vertical-align: middle;
}

.col-nowrap {
  white-space: nowrap;
}

/* ── 文件標題欄 ── */
.doc-title-cell {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.file-icon {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  margin-top: 0.125rem;
  font-size: 0.625rem;
  font-weight: 700;
  border-radius: 0.375rem;
}

.icon-pdf {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.12);
}

.icon-word {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.12);
}

.icon-excel {
  color: #22c55e;
  background: rgba(34, 197, 94, 0.12);
}

.icon-ppt {
  color: #f97316;
  background: rgba(249, 115, 22, 0.12);
}

.icon-txt,
.icon-default {
  color: var(--text-secondary);
  background: var(--bg-tertiary);
}

.doc-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}

.doc-title-text {
  font-weight: 500;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.doc-filename {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.doc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-top: 0.125rem;
}

.doc-tag {
  padding: 0.1rem 0.4rem;
  font-size: 0.6875rem;
  color: var(--primary);
  background: rgba(var(--primary-rgb), 0.1);
  border-radius: 0.25rem;
}

/* ── 狀態徽章 ── */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;
  white-space: nowrap;
}

.status-ready {
  color: var(--success);
  background: rgb(16 185 129 / 10%);
}

.status-processing {
  color: #d97706;
  background: rgb(245 158 11 / 10%);
}

.status-error {
  color: var(--error);
  background: rgb(239 68 68 / 10%);
}

/* ── 操作欄 ── */
.col-actions {
  position: sticky;
  right: 0;
  width: 120px;
  background: var(--bg-secondary);
}

.data-table thead th.col-actions {
  background: var(--bg-tertiary);
}

.data-table tbody tr:hover .col-actions {
  background: var(--bg-tertiary);
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

/* 統一 btn-icon（與 DepartmentTable / StaffTable 完全一致） */
.btn-icon {
  padding: 0.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.btn-icon:hover {
  color: var(--primary);
  background: var(--bg-primary);
}

.btn-icon.btn-danger:hover {
  color: var(--error);
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* ── 空狀態 ── */
.empty-cell {
  padding: 3rem;
  text-align: center;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-secondary);
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  opacity: 0.4;
}
</style>
