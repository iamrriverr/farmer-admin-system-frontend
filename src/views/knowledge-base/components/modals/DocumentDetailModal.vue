<template>
  <BaseModal
    v-model="isOpen"
    :title="isEdit ? '編輯文件資訊' : '文件詳情'"
    size="md"
    :confirm-text="isEdit ? '儲存' : '編輯'"
    :cancel-text="isEdit ? '取消' : '關閉'"
    @confirm="isEdit ? handleSave() : (isEdit = true)"
    @close="handleClose"
  >
    <div v-if="document" class="detail-form">
      <!-- 唯讀：基本資訊 Header -->
      <div class="doc-header">
        <span class="file-icon-lg" :class="getFileIconClass(document.mimeType)">
          {{ getFileIconLabel(document.mimeType) }}
        </span>
        <div class="doc-header-info">
          <p class="doc-original-name">{{ document.filename }}</p>
          <div class="doc-meta-row">
            <span>{{ formatFileSize(document.fileSize) }}</span>
            <span class="dot">·</span>
            <StatusBadge :status="document.status" />
            <span class="dot">·</span>
            <span>{{ document.chunkCount }} 個切片</span>
          </div>
        </div>
      </div>

      <hr class="divider" />

      <!-- 可編輯欄位 -->
      <div class="form-group">
        <label class="form-label required">文件標題</label>
        <input
          v-if="isEdit"
          v-model="formData.title"
          type="text"
          class="form-input"
          placeholder="文件標題"
        />
        <p v-else class="form-value">{{ document.title }}</p>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label required">分類</label>
          <select v-if="isEdit" v-model="formData.category" class="form-select">
            <option v-for="cat in CATEGORIES" :key="cat" :value="cat">{{ cat }}</option>
          </select>
          <p v-else class="form-value">
            <span class="category-badge">{{ document.category }}</span>
          </p>
        </div>

        <div class="form-group">
          <label class="form-label">所屬部門</label>
          <select v-if="isEdit" v-model="formData.department" class="form-select">
            <option value="">公開（無限制）</option>
            <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
          </select>
          <p v-else class="form-value">
            <span v-if="document.department" class="dept-badge">{{ document.department }}</span>
            <span v-else class="text-secondary">公開</span>
          </p>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">標籤</label>
        <template v-if="isEdit">
          <div class="tag-input-wrapper">
            <div class="tag-list">
              <span v-for="tag in formData.tags" :key="tag" class="tag-item">
                {{ tag }}
                <button class="tag-remove" @click="removeTag(tag)">×</button>
              </span>
            </div>
            <input
              v-model="tagInput"
              type="text"
              class="tag-input"
              placeholder="輸入標籤後按 Enter"
              @keyup.enter="addTag"
            />
          </div>
        </template>
        <div v-else class="tag-list-readonly">
          <span v-for="tag in document.tags" :key="tag" class="tag-item">{{ tag }}</span>
          <span v-if="!document.tags.length" class="text-secondary">—</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">說明</label>
        <textarea v-if="isEdit" v-model="formData.description" class="form-textarea" rows="2" />
        <p v-else class="form-value">{{ document.description || '—' }}</p>
      </div>

      <!-- 唯讀：上傳資訊 -->
      <div v-if="!isEdit" class="info-grid">
        <div class="info-item">
          <span class="info-label">上傳者</span>
          <span class="info-value">{{ document.uploadedBy }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">上傳時間</span>
          <span class="info-value">{{ document.uploadedAt }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">最後更新</span>
          <span class="info-value">{{ document.updatedAt }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">文件 ID</span>
          <span class="info-value info-id">{{ document.id }}</span>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineComponent, h } from 'vue';
import BaseModal from '@/components/base/BaseModal.vue';
import type { KnowledgeDocument } from '@/types/knowledge';

const CATEGORIES = ['業務規章', '業務流程', '法規', '內部知識'];

/* ── StatusBadge（行內子組件）── */
const StatusBadge = defineComponent({
  props: { status: String },
  setup(props) {
    return () => {
      const map: Record<string, { label: string; cls: string }> = {
        ready: { label: '已就緒', class: 'status-ready' } as any,
        processing: { label: '處理中', class: 'status-processing' } as any,
        uploading: { label: '上傳中', class: 'status-processing' } as any,
        error: { label: '錯誤', class: 'status-error' } as any,
      };
      const info = map[props.status as string] ?? { label: props.status ?? '', class: '' };
      return h('span', { class: ['status-badge', (info as any).class] }, (info as any).label);
    };
  },
});

/* ── 工具 ── */
const MIME_MAP: Record<string, { label: string; cls: string }> = {
  'application/pdf': { label: 'PDF', cls: 'icon-pdf' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { label: 'DOC', cls: 'icon-word' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { label: 'XLS', cls: 'icon-excel' },
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': { label: 'PPT', cls: 'icon-ppt' },
  'text/plain': { label: 'TXT', cls: 'icon-txt' },
};
const getFileIconLabel = (mime: string) => MIME_MAP[mime]?.label ?? 'FILE';
const getFileIconClass = (mime: string) => MIME_MAP[mime]?.cls ?? 'icon-default';
const formatFileSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/* ── Props / Emits ── */
const props = defineProps<{
  modelValue: boolean;
  document: KnowledgeDocument | null;
  departments: string[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'save', id: string, data: any): void;
}>();

/* ── 狀態 ── */
const isOpen = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});
const isEdit = ref(false);
const tagInput = ref('');
const formData = ref({ title: '', category: '', department: '', tags: [] as string[], description: '' });

watch(
  () => props.document,
  (doc) => {
    isEdit.value = false;
    if (doc) {
      formData.value = {
        title: doc.title,
        category: doc.category,
        department: doc.department,
        tags: [...doc.tags],
        description: doc.description ?? '',
      };
    }
  },
  { immediate: true }
);

/* ── 操作 ── */
const addTag = () => {
  const tag = tagInput.value.trim();
  if (tag && !formData.value.tags.includes(tag)) formData.value.tags.push(tag);
  tagInput.value = '';
};
const removeTag = (tag: string) => {
  formData.value.tags = formData.value.tags.filter((t) => t !== tag);
};

const handleSave = () => {
  if (!props.document) return;
  emit('save', props.document.id, { ...formData.value });
  isEdit.value = false;
};

const handleClose = () => {
  isEdit.value = false;
};
</script>

<style scoped>
.detail-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* ── Header ── */
.doc-header {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.file-icon-lg {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  font-size: 0.6875rem;
  font-weight: 700;
  border-radius: 0.5rem;
  flex-shrink: 0;
}

.icon-pdf    { color: #ef4444; background: rgba(239, 68, 68, 0.12); }
.icon-word   { color: #3b82f6; background: rgba(59, 130, 246, 0.12); }
.icon-excel  { color: #22c55e; background: rgba(34, 197, 94, 0.12); }
.icon-ppt    { color: #f97316; background: rgba(249, 115, 22, 0.12); }
.icon-txt,
.icon-default{ color: var(--text-secondary); background: var(--bg-tertiary); }

.doc-header-info { display: flex; flex-direction: column; gap: 0.375rem; }

.doc-original-name {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.doc-meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  align-items: center;
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.dot { color: var(--border-primary); }

.divider {
  margin: 0;
  border: none;
  border-top: 1px solid var(--border-primary);
}

/* ── 表單 ── */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.form-label.required::after {
  content: ' *';
  color: var(--error);
}

.form-value {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-primary);
  min-height: 1.25rem;
}

.form-input,
.form-select,
.form-textarea {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: var(--text-primary);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 0.5rem;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary);
}

.form-textarea { resize: none; font-family: inherit; }

.text-secondary { color: var(--text-secondary); }

/* ── 分類/部門標籤 ── */
.category-badge {
  padding: 0.2rem 0.5rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 1rem;
}

.dept-badge {
  padding: 0.2rem 0.5rem;
  font-size: 0.75rem;
  color: #7c3aed;
  background: rgba(124, 58, 237, 0.1);
  border-radius: 1rem;
}

/* ── 標籤 ── */
.tag-input-wrapper {
  padding: 0.375rem 0.5rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 0.5rem;
  transition: border-color 0.2s;
}

.tag-input-wrapper:focus-within { border-color: var(--primary); }

.tag-list,
.tag-list-readonly {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 0.25rem;
}

.tag-list-readonly { margin-bottom: 0; }

.tag-item {
  display: inline-flex;
  gap: 0.25rem;
  align-items: center;
  padding: 0.2rem 0.5rem;
  font-size: 0.75rem;
  color: var(--primary);
  background: rgba(var(--primary-rgb), 0.1);
  border-radius: 0.25rem;
}

.tag-remove {
  padding: 0;
  font-size: 0.875rem;
  line-height: 1;
  color: inherit;
  cursor: pointer;
  background: transparent;
  border: none;
  opacity: 0.7;
}

.tag-remove:hover { opacity: 1; }

.tag-input {
  width: 100%;
  padding: 0.25rem;
  font-size: 0.875rem;
  color: var(--text-primary);
  background: transparent;
  border: none;
  outline: none;
}

.tag-input::placeholder { color: var(--text-tertiary); }

/* ── 狀態標籤 ── */
.status-badge {
  padding: 0.15rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 1rem;
}

.status-ready      { color: #16a34a; background: rgba(34, 197, 94, 0.12); }
.status-processing { color: #d97706; background: rgba(245, 158, 11, 0.12); }
.status-error      { color: #dc2626; background: rgba(239, 68, 68, 0.12); }

/* ── 資訊格 ── */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--bg-tertiary);
  border-radius: 0.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.info-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.info-value {
  font-size: 0.875rem;
  color: var(--text-primary);
}

.info-id {
  font-size: 0.75rem;
  font-family: monospace;
  color: var(--text-secondary);
}
</style>
